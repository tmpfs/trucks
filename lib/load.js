const fs = require('fs')
  , path = require('path')
  , cheerio = require('cheerio');

/** 
 *  Loads and parses the input source files.
 *
 *  @function sources
 *
 *  @param {Array} files list of input HTML files.
 *  @param {Function} cb callback function.
 */
function sources(files, cb) {
  let map = {}; 

  function next(err) {
    if(err) {
      return cb(err); 
    }
    const file = files.shift();
    if(!file) {
      return cb(null, map); 
    }

    fs.readFile(file, (err, contents) => {
      if(err) {
        return cb(err); 
      }
      map[file] = contents.toString();
      next();
    })
  }

  next();
}

/** 
 *  Finds all import `<link>` elements in the input component files. 
 *
 *  @function imports
 *
 *  @param {Object} map object mapping filenames to component files.
 *  @param {Function} cb callback function.
 */
function imports(map, cb) {
  let k
    , base
    , relative
    , $
    , out = {};

  function it(index, elem) {
    const href = $(elem).attr('href');
    relative = path.normalize(path.join(base, href));
    out[k].push(relative);
  }

  for(k in map) {
    out[k] = [];
    base = path.dirname(k);
    $ = cheerio.load(map[k]);
    $('link[rel="import"][href]').each(it);
  }

  cb(null, out);
}

/**
 *  @private
 */
function read(name, imports, out, cb) {
  out[name] = []; 

  function next() {
    const file = imports.shift();
    if(!file) {
      return cb(); 
    }

    fs.readFile(file, (err, contents) => {
      if(err) {
        return cb(err); 
      }

      const map = {
        file: file,
        contents: contents.toString()
      }

      // empty component file
      if(!map.contents) {
        return cb(new Error(`component file ${file} is empty`));
      }

      out[name].push(map);

      next();
    })
  }

  next();
}

/** 
 *  Loads component include files.
 *
 *  @function includes
 *
 *  @param {Object} map object mapping filenames to component files.
 *  @param {Function} cb callback function.
 */
function includes(map, cb) {
  const keys = Object.keys(map);

  const out = {};

  function next(err) {
    if(err) {
      return cb(err); 
    }
    const file = keys.shift();
    const imports = map[file];
    if(!file) {
      return cb(null, out); 
    }

    out[file] = [];
    read(file, imports, out, next);
  }

  next();
}

function load(opts, cb) {
  opts = opts || {};

  sources(opts.files || [], (err, map) => {
    if(err) {
      return cb(err); 
    } 
    imports(map, (err, files) => {
      if(err) {
        return cb(err); 
      }
      includes(files, (err, contents) => {
        if(err) {
          return cb(err); 
        }
        cb(null, contents);
      })
    })
  })
}

module.exports = load;
