'use strict';

var fs = require('fs'),
    path = require('path');

function abs(file) {
  if (!path.isAbsolute(file)) {
    return path.normalize(path.join(process.cwd(), file));
  }
  return file;
}

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
  this.seen = {
    sources: [],
    imports: []
  };
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

  var i = void 0,
      source = abs(file),
      dest = void 0;

  for (i = 0; i < hierarchy.length; i++) {
    dest = abs(hierarchy[i]);
    if (source === dest) {
      throw new Error('cyclic dependency detected in ' + name + ' (' + source + ' <> ' + dest + ')');
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
  var files = state.files;
  var map = {};

  function next() {
    var file = files.shift();
    if (!file) {
      return cb(null, map);
    }

    var pth = abs(file);

    if (~state.seen.sources.indexOf(pth)) {
      // this could just ignore and move on to the next
      // file to process but prefer to be strict and error
      return cb(new Error('duplicate component source file ' + file));
    }

    state.seen.sources.push(pth);

    fs.readFile(file, function (err, contents) {
      if (err) {
        return cb(err);
      }
      map[file] = contents.toString();
      next();
    });
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

  var opts = state.opts,
      cheerio = require('cheerio');

  var k = void 0,
      base = void 0,
      relative = void 0,
      $ = void 0,
      out = {};

  function it(index, elem) {
    var href = $(elem).attr('href');
    relative = path.normalize(path.join(base, href));

    out[k].push(relative);
  }

  for (k in map) {
    out[k] = [];
    base = path.dirname(k);
    $ = cheerio.load(map[k]);
    var elements = $(opts.selectors.imports);

    if (!elements.length) {
      return cb(new Error('component file ' + k + ' does not import components'));
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
  var opts = state.opts;

  function next(err) {
    if (err) {
      return cb(err);
    }

    var file = list.shift();
    if (!file) {
      return cb();
    }

    // cyclic dependency: must be tested before the logic to ignore
    // duplicate components as we want to notify users on circular dependency
    try {
      cyclic(file, state.hierarchy, name);
    } catch (e) {
      return next(e);
    }

    // duplicate component: do no not re-read components that have already
    // been loaded
    var pth = abs(file);
    if (~state.seen.imports.indexOf(pth)) {
      return next();
    }
    state.seen.imports.push(pth);

    fs.readFile(file, function (err, contents) {
      if (err) {
        return next(err);
      }

      var map = {
        file: file,
        parent: name,
        contents: contents.toString()
      };

      // empty component file
      if (!map.contents) {
        return next(new Error('empty component file ' + file));
      }

      // prepend the loaded component information so that
      // dependencies appear before the declaring component
      state.out.unshift(map);

      var cheerio = require('cheerio'),
          $ = cheerio.load(map.contents),
          dependencies = $(opts.selectors.imports);

      // component has dependencies we need to load
      if (dependencies.length) {

        // map of dependencies
        var deps = {};
        deps[file] = map.contents;

        run(deps, state, next);
        // no dependencies move on to the next item in the list
      } else {
        next();
      }
    });
  }

  next();
}

/** 
 *  Loads component import file contents.
 *
 *  @private {function} includes
 *
 *  @param {Object} map object mapping filenames to component files.
 *  @param {Array} out output result object.
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 */
function includes(map, state, cb) {
  var keys = Object.keys(map),
      out = state.out,
      hierarchy = state.hierarchy;

  function next(err) {
    if (err) {
      return cb(err);
    }
    var file = keys.shift();
    if (!file) {
      return cb(null, out);
    }

    hierarchy.push(file);

    read(file, map[file], state, next);
  }

  next();
}

/**
 *  @private
 */
function run(map, state, cb) {

  // process html imports
  imports(map, state, function (err, files) {
    if (err) {
      return cb(err);
    }

    // load component include files
    includes(files, state, function (err, contents) {
      if (err) {
        return cb(err);
      }
      cb(null, contents);
    });
  });
}

/**
 *  @private
 */
function load(opts, cb) {
  opts = opts || {};

  if (!opts.files || !opts.files.length) {
    return cb(new Error('no input files specified'));
  }

  var out = [],
      state = new State(out, opts);

  // load source file contents
  sources(state, function (err, map) {
    if (err) {
      return cb(err);
    }

    // run processing for the input sources
    run(map, state, function (err) {
      if (err) {
        return cb(err);
      }

      cb(null, out);
    });
  });
}

module.exports = load;