/**
 *  @private
 *
 *  Simple async series iterator.
 */
function each(list, it, cb) {

  function next(err) {
    if(err) {
      return cb(err); 
    } 

    const item = list.shift();

    if(!item) {
      return cb(null); 
    }

    it(item, next);
  }

  next();
}

module.exports = each;
