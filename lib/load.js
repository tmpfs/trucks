'use strict';

var fs = require('fs'),
    path = require('path');

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
    if (!path.isAbsolute(file)) {
      return path.normalize(path.join(process.cwd(), file));
    }
    return file;
  }

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
 *  @param {Array} files list of input HTML files.
 *  @param {Function} cb callback function.
 */
function sources(files, cb) {
  var map = {};

  function next() {
    var file = files.shift();
    if (!file) {
      return cb(null, map);
    }

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
function imports(map, opts, cb) {

  var cheerio = require('cheerio');

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
    var elements = $(opts.selectors.import);

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
function read(name, list, hierarchy, out, opts, cb) {

  function next(err) {
    if (err) {
      return cb(err);
    }

    var file = list.shift();
    if (!file) {
      return cb();
    }

    fs.readFile(file, function (err, contents) {
      if (err) {
        return next(err);
      }

      var map = {
        file: file,
        parent: name,
        contents: contents.toString()
      };

      //console.dir(file);
      //console.dir(hierarchy);

      // cyclic dependency
      try {
        cyclic(file, hierarchy, name);
      } catch (e) {
        return next(e);
      }

      // empty component file
      if (!map.contents) {
        return next(new Error('empty component file ' + file));
      }

      // prepend the loaded component information so that
      // dependencies appear before the declaring component
      out.unshift(map);

      var cheerio = require('cheerio'),
          $ = cheerio.load(map.contents),
          dependencies = $(opts.selectors.import);

      // component has dependencies we need to load
      if (dependencies.length) {

        // map of dependencies
        var deps = {};
        deps[file] = map.contents;

        run(deps, out, hierarchy, opts, next);
        // no dependencies move on to the next item in the list
      } else {
        next();
      }
    });
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
function includes(map, out, hierarchy, opts, cb) {
  var keys = Object.keys(map);

  function next(err) {
    if (err) {
      return cb(err);
    }
    var file = keys.shift();
    if (!file) {
      return cb(null, out);
    }

    hierarchy = hierarchy || [];
    hierarchy.push(file);

    read(file, map[file], hierarchy, out, opts, next);
  }

  next();
}

/**
 *  @private
 */
function run(map, out, hierarchy, opts, cb) {

  // process html imports
  imports(map, opts, function (err, files) {
    if (err) {
      return cb(err);
    }

    // load component include files
    includes(files, out, hierarchy, opts, function (err, contents) {
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

  var out = [];

  // load source file contents
  sources(opts.files, function (err, map) {
    if (err) {
      return cb(err);
    }

    run(map, out, null, opts, function (err) {
      if (err) {
        return cb(err);
      }

      cb(null, out);
    });
  });
}

module.exports = load;