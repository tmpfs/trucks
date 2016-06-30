const fs = require('fs');

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

  function writer(path, contents) {
    return function write(cb) {
      fs.writeFile(path, contents, cb);
    } 
  }

  const writers = [];

  if(opts.css) {
    writers.push(writer(opts.css, generated.stylesheet)); 
  }
  
  if(opts.js) {
    writers.push(writer(opts.js, generated.javascript)); 
  }

  if(opts.html) {
    writers.push(writer(opts.html, generated.html)); 
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
