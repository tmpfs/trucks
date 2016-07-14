const path = require('path');

function abs(file, base) {
  if(!path.isAbsolute(file)) {
    base = base || process.cwd();
    return path.normalize(path.join(base, file)); 
  }
  return file;
}

module.exports = abs;
