const fs = require('fs')

function write(state, conf) {
  let manifest;

  if(conf.manifest || state.options.manifest) {
    manifest = state.manifest = {};
  }

  return function write(state, cb) {
    const opts = state.options
        , output = state.output;

    function writer(path, file) {
      const contents = file.contents;

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

            if(manifest) {
              manifest[path] = {
                name: file.name,
                file: path,
                contents: contents
              }
            }

            cb();
          });
        });
      } 
    }

    const files = Object.keys(output)
        , writers = [];

    // map output files to writer functions
    files.forEach((file) => {
      writers.push(writer(file, output[file])); 
    })

    state.each(
      writers,
      (fn, next) => {
        fn(next); 
      }, cb);
  }

}

module.exports = write;
