"use strict";

/**
 *  @private
 *
 *  Simple async series iterator.
 */
function each(list, it, cb) {
  list = list.slice();

  function next(err) {
    if (err) {
      return cb(err);
    }

    var item = list.shift();
    if (!item) {
      return cb(null);
    }
    it(item, next);
  }
  next();
}

module.exports = each;