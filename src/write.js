const fs = require('fs')
  , HTML = 'html'
  , CSS = 'css'
  , JS = 'js';

/**
 *  @private
 */
function write(generated, opts, cb) {
  // no file paths specified, nothing to write
  if(!opts.css && !opts.js) {
    return cb(null, generated); 
  }

  if(opts.css && !generated.stylesheet) {
    return cb(new Error('no stylesheet data available to write')); 
  }else if(opts.js && !generated.javascript) {
    return cb(new Error('no javascript data available to write')); 
  }


  // track files that were written consumers (such as a cli)
  // might want to stat afterwards for bytes written
  generated.files = {};

  function writer(key, path, contents) {
    return function write(cb) {
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
    } 
  }

  const writers = [];

  if(opts.html) {
    writers.push(writer(HTML, opts.html, generated.html)); 
  }

  if(opts.css) {
    writers.push(writer(CSS, opts.css, generated.stylesheet)); 
  }
  
  if(opts.js) {
    writers.push(writer(JS, opts.js, generated.javascript)); 
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
