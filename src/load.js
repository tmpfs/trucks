const fs = require('fs')
    , path = require('path');

/** 
 *  Loads and parses the input source files.
 *
 *  Produces a map of file names to file contents.
 *
 *  @private {function} sources
 *
 *  @param {Array} files list of input HTML files.
 *  @param {Function} cb callback function.
 */
function sources(files, cb) {
  let map = {}; 

  function next() {
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
 *  Finds all import `<link rel="import">` elements in the input 
 *  component files. 
 *
 *  @private {function} imports
 *
 *  @param {Object} map object mapping filenames to component files.
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @throws Error if the component file does not declare any imports.
 */
function imports(map, opts, cb) {

  const cheerio = require('cheerio');

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
    const elements = $(opts.selectors.import);

    if(!elements.length) {
      return cb(new Error(`component file ${k} does not import components`)); 
    }
      
    elements.each(it);
  }

  cb(null, out);
}

/**
 *  Read file contents.
 *
 *  @private {function} read
 */
function read(name, list, out, opts, cb) {
  //out[name] = []; 

  function next(err) {
    if(err) {
      return cb(err); 
    } 

    const file = list.shift();
    if(!file) {
      return cb(); 
    }

    fs.readFile(file, (err, contents) => {
      if(err) {
        return next(err); 
      }

      const map = {
        file: file,
        parent: name,
        contents: contents.toString()
      }

      // empty component file
      if(!map.contents) {
        return next(new Error(`empty component file ${file}`));
      }

      // prepend the loaded component information so that
      // dependencies appear before the declaring component
      out.unshift(map);

      const cheerio = require('cheerio')
        , $ = cheerio.load(map.contents)
        , dependencies = $(opts.selectors.import);

      // component has dependencies we need to load
      if(dependencies.length) {

        // map of dependencies
        let deps = {};
        deps[file] = map.contents;

        process(deps, out, opts, next);
      // no dependencies move on to the next item in the list
      }else{
        next();
      }
    })
  }

  next();
}

/** 
 *  Loads component include files.
 *
 *  @private {function} includes
 *
 *  @param {Object} map object mapping filenames to component files.
 *  @param {Object} out output result object.
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 */
function includes(map, out, opts, cb) {
  const keys = Object.keys(map);

  function next(err) {
    if(err) {
      return cb(err); 
    }
    const file = keys.shift();
    if(!file) {
      return cb(null, out); 
    }

    //out[file] = [];
    read(file, map[file], out, opts, next);
  }

  next();
}

/**
 *  @private
 */
function process(map, out, opts, cb) {
  // process html imports
  imports(map, opts, (err, files) => {
    if(err) {
      return cb(err); 
    }

    // load component include files
    includes(files, out, opts, (err, contents) => {
      if(err) {
        return cb(err); 
      }
      cb(null, contents);
    })
  })
}

/**
 *  @private
 */
function load(opts, cb) {
  opts = opts || {};

  if(!opts.files || !opts.files.length) {
    return cb(new Error('no input files specified'));
  }

  const out = [];

  // load source file contents
  sources(opts.files, (err, map) => {
    if(err) {
      return cb(err); 
    }

    process(map, out, opts, (err) => {
      if(err) {
        return cb(err); 
      } 

      cb(null, out);
    });

  })
}

module.exports = load;
