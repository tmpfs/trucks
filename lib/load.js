'use strict';

var fs = require('fs'),
    path = require('path');

/** 
 *  Loads and parses the input source files.
 *
 *  @function sources
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
 *  @function imports
 *
 *  @param {Object} map object mapping filenames to component files.
 *  @param {Function} cb callback function.
 */
function imports(map, cb) {

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
 *  @private
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
 *  @function includes
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

  sources(opts.files, function (err, map) {
    if (err) {
      return cb(err);
    }
    imports(map, function (err, files) {
      if (err) {
        return cb(err);
      }
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