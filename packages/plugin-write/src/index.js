function write(state, conf) {
  const fs = require('fs')
      , crypto = require('crypto');

  let manifest
    , options = conf.manifest || state.options.manifest;

  if(options) {
    manifest = state.manifest = {};

    if(options && options !== Object(options)) {
      options = {
        hash: 'sha256',
        digest: 'hex'
      } 
    }
  }

  console.log('writing manifest %j', options);

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

            let item;

            if(manifest) {
              const hash = crypto.createHash(options.hash);
              hash.update(contents);

              item = {
                file: path,
                name: file.name,
                base: file.base,
                size: Buffer.byteLength(contents),
                checksum: hash.digest(options.digest)
              }

              manifest[path] = item;
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
