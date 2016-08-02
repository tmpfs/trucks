function write(state, conf) {
  const fs = require('fs')
      , path = require('path')
      , crypto = require('crypto');

  conf = state.options.write || conf;

  conf.mkdirs = conf.mkdirs !== undefined ? conf.mkdirs : true;

  let mkdir;

  if(!conf.mkdirs) {
    mkdir = (path, cb) => cb();
  }else{
    mkdir = require('mkdirp')
  }

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

  return function write(state, cb) {
    const opts = state.options
        , output = state.output;

    function writer(file, output) {
      const contents = output.contents;

      return function write(cb) {
        fs.stat(file, (err, stat) => {
          // NOTE: if file is a directory we'll let if fall through to 
          // NOTE: an EISDIR error on attempt to write
          if(stat && stat.isFile() && !opts.force) {
            return cb(new Error(`cannot overwrite ${file}`)); 
          }

          const owner = path.dirname(file);
          mkdir(owner, (err) => {
            if(err) {
              return cb(err); 
            } 
            fs.writeFile(file, contents, (err) => {
              if(err) {
                return cb(err); 
              } 

              let item;

              if(manifest) {
                const hash = crypto.createHash(options.hash);
                hash.update(contents);

                item = {
                  size: Buffer.byteLength(contents),
                  checksum: hash.digest(options.digest)
                }

                manifest[file] = item;
              }

              cb();
            });

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
