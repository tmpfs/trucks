const load = require('./load')
  , parse = require('./parse')
  , transform = require('./transform')
  , generate = require('./generate');

/**
 *  Compile component HTML files to CSS and Javascript.
 *
 *  @function trucks
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {Array} files list of HTML files to compile.
 */
function trucks(opts, cb) {
  opts = opts || {};

  load(opts, (err, loaded) => {
    if(err) {
      return cb(err); 
    } 
    parse(loaded, (err, parsed) => {
      if(err) {
        return cb(err); 
      }
      transform(parsed, (err, transformed) => {
        if(err) {
          return cb(err); 
        }
        generate(transformed, (err, generated) => {
          if(err) {
            return cb(err); 
          }

          cb(null, generated);
        });
      });
    });
  })
}

trucks.load = load;
trucks.parse = parse;
trucks.transform = transform;
trucks.generate = generate;

module.exports = trucks;
