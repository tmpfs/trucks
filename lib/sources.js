const fs = require('fs');

/** 
 *  Loads and parses the input source files.
 *
 *  @function sources
 *
 *  @param {Array} files list of input HTML files.
 *  @param {Function} cb callback function.
 */
function sources(files, cb) {
  let map = {}; 

  function next(err) {
    if(err) {
      return cb(err); 
    }
    const file = files.shift();
    if(!file) {
      return cb(null, map); 
    }

    fs.readFile(file, (err, contents) => {
      if(err) {
        return cb(err); 
      }
      map[file] = contents.toString();
      next();
    })
  }

  next();
}

module.exports = sources;
