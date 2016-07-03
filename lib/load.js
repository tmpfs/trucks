'use strict';

var fs = require('fs'),
    path = require('path');

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
function read(name, list, out, opts, cb) {
  out[name] = [];

  function next() {
    var file = list.shift();
    if (!file) {
      return cb();
    }

    fs.readFile(file, function (err, contents) {
      if (err) {
        return cb(err);
      }

      var map = {
        file: file,
        contents: contents.toString()
      };

      // empty component file
      if (!map.contents) {
        return cb(new Error('empty component file ' + file));
      }

      // prepend the loaded component information so that
      // dependencies appear before the declaring component
      out[name].unshift(map);

      var cheerio = require('cheerio'),
          $ = cheerio.load(map.contents),
          dependencies = $(opts.selectors.import);

      // component has dependencies we need to load
      if (dependencies.length) {
        // map of dependencies
        var deps = {};
        deps[file] = map.contents;

        process(deps, out, opts, function (err /*, contents*/) {
          if (err) {
            return cb(err);
          }

          //out[file].unshift(map);

          next();
        });
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
 *  @param {Object} out output result object.
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 */
function includes(map, out, opts, cb) {
  var keys = Object.keys(map);

  //const out = {};

  function next(err) {
    if (err) {
      return cb(err);
    }
    var file = keys.shift();
    var list = map[file];
    if (!file) {
      return cb(null, out);
    }

    out[file] = [];
    read(file, list, out, opts, next);
  }

  next();
}

/**
 *  @private
 */
function process(map, out, opts, cb) {
  // process html imports
  imports(map, opts, function (err, files) {
    if (err) {
      return cb(err);
    }

    // load component include files
    includes(files, out, opts, function (err, contents) {
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

  var out = {};

  // load source file contents
  sources(opts.files, function (err, map) {
    if (err) {
      return cb(err);
    }

    //console.dir(map);

    process(map, out, opts, function (err) {
      if (err) {
        return cb(err);
      }

      console.dir('LOAD RESULT');
      console.dir(out);

      cb(null, out);
    });
  });
}

module.exports = load;