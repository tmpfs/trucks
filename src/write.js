const fs = require('fs');

/**
 *  @private
 */
function write(result, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts = opts || {};

  // no file paths specified, nothing to write
  if(!opts.css && !opts.js) {
    return cb(null, result); 
  }

  if(opts.css && !result.stylesheet) {
    return cb(new Error('no stylesheet data available to write')); 
  }else if(opts.js && !result.javascript) {
    return cb(new Error('no javascript data available to write')); 
  }

  cb(null, result);
}

module.exports = write;
