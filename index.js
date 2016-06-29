const load = require('./lib/load')
  , parse = require('./lib/parse');

/**
 *  Compile component HTML files to CSS and Javascript.
 *
 *  @function trucks
 *  @param (Object) opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {Array} files list of HTML files to compile.
 */
function trucks(opts, cb) {
  opts = opts || {};

  load(opts || [], (err, contents) => {
    if(err) {
      return cb(err); 
    } 
    parse(contents, function(err, result) {
      if(err) {
        return cb(err); 
      }
      console.log(result);
      cb(null, result);
    });
  })
}

module.exports = trucks;
