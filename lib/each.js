"use strict";

/**
 *  @private
 *
 *  Simple async series iterator.
 */
function each(list, cb, args, scope) {

  function next(err) {
    if (err) {
      return cb(err);
    }

    var fn = list.shift();

    if (!fn) {
      return cb(null);
    }

    args = args || [];
    args.push(next);

    fn.apply(scope, args);
  }

  next();
}

module.exports = each;