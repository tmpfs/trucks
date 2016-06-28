const sources = require('./lib/sources');
const imports = require('./lib/imports');
const includes = require('./lib/includes');
const parser = require('./lib/parser');

function trucks(opts, cb) {
  opts = opts || {};

  sources(opts.files || [], (err, map) => {
    if(err) {
      return cb(err); 
    } 
    imports(map, (err, files) => {
      if(err) {
        return cb(err); 
      }
      includes(files, (err, contents) => {
        if(err) {
          return cb(err); 
        }
        parser(contents, function(err, result) {
          if(err) {
            return cb(err); 
          }
          console.log(result);
          cb(null, result);
        });
      })
    })
  })
}

module.exports = trucks;
