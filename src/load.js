const fs = require('fs')
    , path = require('path');

/**
 *  Encapsulates the load state information.
 *
 *  @private {constructor} State
 *  @param {Array} out list for the output result objects.
 *  @param {Object} opts processing options.
 */
function State(out, opts) {
  this.out = out;
  this.opts = opts;
  // source input files passed to be loaded
  this.files = opts.files;

  // list of parent file hierarchies used to detect circular imports
  this.hierarchy = [];

  // list of component files that have been processed used to prevent
  // duplication compilation when multiple components share the same
  // dependency
  this.seen = [];
}

/**
 *  Helper to test for cyclic depenendeices.
 *
 *  @private {function} cyclic
 *  @param {String} file path to the file to load.
 *  @param {Array} list of paths in the hierarchy.
 *  @param {String} name the name of the declaring file.
 *
 *  @throws Error if a circular dependency is detected.
 */
function cyclic(file, hierarchy, name) {

  function abs(file) {
    if(!path.isAbsolute(file)) {
      return path.normalize(path.join(process.cwd(), file)); 
    }
    return file;
  }

  let i
    , source = abs(file)
    , dest;

  for(i = 0;i < hierarchy.length;i++) {
    dest = abs(hierarchy[i]);
    if(source === dest) {
      throw new Error(
        `cyclic dependency detected in ${name} (${source} <> ${dest})`);
    }
  }
}

/** 
 *  Loads and parses the input source files.
 *
 *  Produces a map of file names to file contents.
 *
 *  @private {function} sources
 *
 *  @param {Object} state processing state.
 *  @param {Function} cb callback function.
 */
function sources(state, cb) {
  const files = state.files;
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
function imports(map, state, cb) {

  const opts = state.opts
    , cheerio = require('cheerio');

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
function read(name, list, state, cb) {
  const opts = state.opts;

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

      //console.dir(file);
      //console.dir(hierarchy);

      // cyclic dependency
      try {
        cyclic(file, state.hierarchy, name);
      }catch(e) {
        return next(e); 
      }

      // empty component file
      if(!map.contents) {
        return next(new Error(`empty component file ${file}`));
      }

      // prepend the loaded component information so that
      // dependencies appear before the declaring component
      state.out.unshift(map);

      const cheerio = require('cheerio')
        , $ = cheerio.load(map.contents)
        , dependencies = $(opts.selectors.import);

      // component has dependencies we need to load
      if(dependencies.length) {

        // map of dependencies
        let deps = {};
        deps[file] = map.contents;

        run(deps, state, next);
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
 *  @param {Array} out output result object.
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 */
function includes(map, state, cb) {
  const keys = Object.keys(map)
    , out = state.out
    , hierarchy = state.hierarchy;

  function next(err) {
    if(err) {
      return cb(err); 
    }
    const file = keys.shift();
    if(!file) {
      return cb(null, out); 
    }

    //hierarchy = hierarchy || [];
    hierarchy.push(file);

    read(file, map[file], state, next);
  }

  next();
}

/**
 *  @private
 */
function run(map, state, cb) {

  //console.dir(map);

  // process html imports
  imports(map, state, (err, files) => {
    if(err) {
      return cb(err); 
    }

    // load component include files
    includes(files, state, (err, contents) => {
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

  const out = []
    , state = new State(out, opts);

  // load source file contents
  sources(state, (err, map) => {
    if(err) {
      return cb(err); 
    }

    // run processing for the input sources
    run(map, state, (err) => {
      if(err) {
        return cb(err); 
      } 

      cb(null, out);
    });

  })
}

module.exports = load;
