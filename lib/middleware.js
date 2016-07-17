'use strict';

var path = require('path');

/**
 *  Helper function to locate and invoke middleware functions.
 *
 *  @private {function} middleware
 *  @param {Object} state input compiler state.
 *  @param {Object} options middleware configuration options.
 *
 *  @throws Error if an object definition does not have a plugin function.
 *  @throws Error if the middleware function errors.
 */
function middleware(state, options) {
  var i = void 0,
      phases = options.phases,
      lookup = options.lookup || {},
      prefix = options.prefix,
      phase = void 0,
      detail = void 0,
      middleware = [],
      closures = [];

  function getDetail(phase) {
    var out = {};

    if (phase === String(phase)) {
      out.name = phase;
    } else if (phase instanceof Function) {
      out.name = phase.name;
      // object function name
    } else if (phase && phase.plugin && phase.plugin.name) {
      out.name = phase.plugin.name;
    }

    var conf = {};

    if (out.name) {
      if (lookup[out.name] && lookup[out.name] === Object(lookup[out.name])) {
        conf = lookup[out.name];
      }
    }

    out.conf = conf;
    return out;
  }

  function getClosure(phase, detail) {
    var closure = void 0;
    // assume plugin is middleware
    if (phase instanceof Function) {
      closure = phase(state, detail.conf);
    } else if (phase === String(phase)) {
      var file = phase;
      if (prefix && !path.isAbsolute(phase) && !/^\.*\//.test(phase)) {
        file = prefix + file;
      }
      closure = require(file)(state, detail.conf);
    } else if (phase && phase === Object(phase)) {
      if (!phase.plugin || !(phase.plugin instanceof Function)) {
        throw new Error('object middleware does not define plugin function');
      }
      detail = getDetail(phase.plugin);
      var fn = phase.plugin;
      delete phase.plugin;

      // use input object as configuration
      detail.conf = phase;

      return getClosure(fn, detail);
    }

    // closure returned an array of middleware to defer to
    // so invoke each function
    if (Array.isArray(closure)) {
      var j = void 0,
          _closures = [];
      for (j = 0; j < closure.length; j++) {
        _closures = _closures.concat(getClosure(closure[j], detail));
      }
      return _closures;
      //}else if(closure) {
      //if(!closure.name) {
      //throw new Error('anonymous plugin functions are not allowed');
      //}  
    }

    return [closure];
  }

  for (i = 0; i < phases.length; i++) {
    phase = phases[i];
    detail = getDetail(phase);
    closures = closures.concat(getClosure(phase, detail));
  }

  closures.forEach(function (closure) {
    middleware.push(closure);
  });

  return middleware;
}

module.exports = middleware;