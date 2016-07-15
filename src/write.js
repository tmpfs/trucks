const fs = require('fs')
    , each = require('./each')
    , HTML = 'html'
    , CSS = 'css'
    , JS = 'js';

/**
 *  @private
 */
function write(input, cb) {
  const opts = input.options
    , generated = input.result.generate
    , written = input.result.write || {};

  // track files that were written consumers (such as a cli)
  // might want to stat afterwards for bytes written
  written.files = {};

  function writer(key, path, contents) {
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

          written.files[key] = {
            file: path,
            contents: contents
          }

          cb();
        });
      });
    } 
  }

  const writers = [];

  if(opts.html && opts.extract) {
    writers.push(writer(HTML, opts.html, generated.html)); 
  }

  if(opts.css) {
    writers.push(writer(CSS, opts.css, generated.stylesheet)); 
  }
  
  if(opts.js) {
    writers.push(writer(JS, opts.js, generated.javascript)); 
  }

  each(
    writers,
    (fn, next) => {
      fn(next); 
    }, cb);
}

module.exports = write;
