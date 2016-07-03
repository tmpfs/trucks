'use strict';

var fs = require('fs'),
    path = require('path');

/** 
 *  Loads and parses the input source files.
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
 *  Finds all import `<link>` elements in the input component files. 
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
    var elements = $('link[rel="import"][href]');

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
function read(name, imports, out, cb) {
  out[name] = [];

  function next() {
    var file = imports.shift();
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

      out[name].push(map);

      next();
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
 *  @param {Function} cb callback function.
 */
function includes(map, cb) {
  var keys = Object.keys(map);

  var out = {};

  function next(err) {
    if (err) {
      return cb(err);
    }
    var file = keys.shift();
    var imports = map[file];
    if (!file) {
      return cb(null, out);
    }

    out[file] = [];
    read(file, imports, out, next);
  }

  next();
}

/**
 *  @private
 */
function load(opts, cb) {
  opts = opts || {};

  if (!opts.files || !opts.files.length) {
    return cb(new Error('no input files specified'));
  }

  // load source file contents
  sources(opts.files, function (err, map) {
    if (err) {
      return cb(err);
    }

    // process html imports
    imports(map, opts, function (err, files) {
      if (err) {
        return cb(err);
      }

      // load component include files
      includes(files, function (err, contents) {
        if (err) {
          return cb(err);
        }
        cb(null, contents);
      });
    });
  });
}

module.exports = load;