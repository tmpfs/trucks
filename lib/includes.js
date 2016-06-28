const fs = require('fs');

/**
 *  @private
 */
function load(name, imports, out, cb) {
  out[name] = []; 

  function next() {
    const file = imports.shift();
    if(!file) {
      return cb(); 
    }

    fs.readFile(file, (err, contents) => {
      if(err) {
        return cb(err); 
      }

      const map = {
        file: file,
        contents: contents.toString()
      }

      // empty component file
      if(!map.contents) {
        return cb(new Error(`component file ${file} is empty`));
      }

      out[name].push(map);

      next();
    })
  }

  next();
}

/** 
 *  Loads component include files.
 *
 *  @function includes
 *
 *  @param {Object} map object mapping filenames to component files.
 *  @param {Function} cb callback function.
 */
function includes(map, cb) {
  const keys = Object.keys(map);

  let out = {};

  function next(err) {
    if(err) {
      return cb(err); 
    }
    const file = keys.shift();
    const imports = map[file];
    if(!file) {
      return cb(null, out); 
    }

    out[file] = [];
    load(file, imports, out, next);
  }

  next();
}

module.exports = includes;
