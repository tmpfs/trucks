const fs = require('fs')
  , path = require('path')
  , NAME = 'components'
  , HTML = 'html'
  , CSS = 'css'
  , JS = 'js';

/**
 *  @private
 */
function write(generated, opts, cb) {

  // track files that were written consumers (such as a cli)
  // might want to stat afterwards for bytes written
  generated.files = {};

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

          generated.files[key] = {
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

  if(html && !generated.html) {
    return cb(new Error('no html data available to write')); 
  }else if(css && !generated.stylesheet) {
    return cb(new Error('no stylesheet data available to write')); 
  }else if(js && !generated.javascript) {
    return cb(new Error('no javascript data available to write')); 
  }


  const writers = [];

  if(html) {
    writers.push(writer(HTML, html, generated.html)); 
  }

  if(css) {
    writers.push(writer(CSS, css, generated.stylesheet)); 
  }
  
  if(js) {
    writers.push(writer(JS, js, generated.javascript)); 
  }

  function next(err) {
    if(err) {
      return cb(err); 
    } 

    const fn = writers.shift();
    if(!fn) {
      return cb(null, generated); 
    }

    fn(next);
  }
  next();
}

module.exports = write;
