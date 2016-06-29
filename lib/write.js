'use strict';

var fs = require('fs');

/**
 *  @private
 */
function write(result, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts = opts || {};

  // no file paths specified, nothing to write
  if (!opts.css && !opts.js) {
    return cb(null, result);
  }

  if (opts.css && !result.stylesheet) {
    return cb(new Error('no stylesheet data available to write'));
  } else if (opts.js && !result.javascript) {
    return cb(new Error('no javascript data available to write'));
  }

  function writer(path, contents) {
    return function write(cb) {
      fs.writeFile(path, contents, cb);
    };
  }

  var writers = [];

  if (opts.css) {
    writers.push(writer(opts.css, result.stylesheet));
  }

  if (opts.js) {
    writers.push(writer(opts.js, result.javascript));
  }

  function next(err) {
    if (err) {
      return cb(err);
    }

    var fn = writers.shift();
    if (!fn) {
      return cb(null, result);
    }

    fn(next);
  }

  next();

  //cb(null, result);
}

module.exports = write;