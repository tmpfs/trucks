const fs = require('fs')

function write(/*state, conf*/) {

  return function write(state, cb) {
    const opts = state.options
      , output = state.output;

    function writer(path, contents) {
      return function write(cb) {
        fs.stat(path, (err, stat) => {
          // NOTE: if path is a directory we'll let if fall through to 
          // NOTE: an EISDIR error on attempt to write
          if(stat && stat.isFile() && !opts.force) {
            return cb(new Error(`cannot overwrite ${path}`)); 
          }
          fs.writeFile(path, contents, (err) => {
            if(err) {
              return cb(err); 
            } 

            output[path].result = {
              file: path,
              contents: contents
            }

            cb();
          });
        });
      } 
    }

    const files = Object.keys(state.output)
        , writers = [];

    // map output files to writer functions
    files.forEach((file) => {
      writers.push(writer(file, state.output[file].contents)); 
    })

    state.each(
      writers,
      (fn, next) => {
        fn(next); 
      }, cb);
  }

}

module.exports = write;
