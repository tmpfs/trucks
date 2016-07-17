'use strict';

var fs = require('fs');

function plugin() /*state, conf*/{

  return function write(state, cb) {
    var opts = state.options,
        output = state.output;

    function writer(path, contents) {
      return function write(cb) {
        fs.stat(path, function (err, stat) {
          // NOTE: if path is a directory we'll let if fall through to 
          // NOTE: an EISDIR error on attempt to write
          if (stat && stat.isFile() && !opts.force) {
            return cb(new Error('cannot overwrite ' + path));
          }
          fs.writeFile(path, contents, function (err) {
            if (err) {
              return cb(err);
            }

            output[path].result = {
              file: path,
              contents: contents
            };

            cb();
          });
        });
      };
    }

    var files = Object.keys(state.output),
        writers = [];

    // map output files to writer functions
    files.forEach(function (file) {
      writers.push(writer(file, state.output[file].contents));
    });

    state.each(writers, function (fn, next) {
      fn(next);
    }, cb);
  };
}

module.exports = plugin;