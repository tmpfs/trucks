const fs = require('fs')
    , path = require('path')
    , each = require('./each')
    , NAME = 'components'
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

  let html
    , css
    , js;

  // output directory and file name
  if(opts.out === String(opts.out)) {
    opts.name = opts.name || NAME;

    // build output paths using `out` directory and `name` options
    html = path.join(opts.out, `${opts.name}.${HTML}`);
    css = path.join(opts.out, `${opts.name}.${CSS}`);
    js = path.join(opts.out, `${opts.name}.${JS}`);
  }

  // specific overrides for each output type
  if(opts.html === String(opts.html)) {
    html = opts.html; 
  }

  if(opts.css === String(opts.css)) {
    css = opts.css; 
  }

  if(opts.js === String(opts.js)) {
    js = opts.js; 
  }

  const writers = [];

  if(html && opts.extract) {
    writers.push(writer(HTML, html, generated.html)); 
  }

  if(css) {
    writers.push(writer(CSS, css, generated.stylesheet)); 
  }
  
  if(js) {
    writers.push(writer(JS, js, generated.javascript)); 
  }

  each(
    writers,
    (fn, next) => {
      fn(next); 
    }, cb);
}

module.exports = write;
