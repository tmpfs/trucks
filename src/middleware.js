const path = require('path');

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
  let i
    , phases = options.phases
    , lookup = options.lookup || {}
    , prefix = options.prefix
    , phase
    , detail
    , middleware = []
    , closures = [];

  function getDetail(phase) {
    const out = {}; 

    if(phase === String(phase)) {
      out.name = phase; 
    }else if(phase instanceof Function) {
      out.name = phase.name; 
    // object function name
    }else if(phase && phase.plugin && phase.plugin.name) {
      out.name = phase.plugin.name; 
    }

    let conf = {};

    if(out.name) {
      if(lookup[out.name]
        && lookup[out.name] === Object(lookup[out.name])) {
        conf = lookup[out.name];
      } 
    }

    out.conf = conf;
    return out;
  }

  function getClosure(phase, detail) {
    let fn
      , closure; 
    // assume plugin is middleware
    if(phase instanceof Function) {
      fn = phase;
      //closure = phase(state, detail.conf);
    }else if(phase === String(phase)) {
      let file = phase;
      if(prefix && !path.isAbsolute(phase) && !/^\.*\//.test(phase)) {
        file = prefix + file; 

        // during tests or debugging try to avoid loading
        // from `lib` for prefixed plugins, prefer `/src`
        if((process.env.DEBUG
            || process.env.NODE_ENV === 'test')
            && !/\/src$/.test(file)) {
          file = file + '/src';
        }
      }

      try {
        fn = require(file);
      }catch(e) {
        const base = state.options.base || process.cwd();
        console.dir(base);
        // try to require relative to cwd
        const Module = require('module')
        const req = Module._resolveFilename(file, {
          id: base,
          filename: base + '/noop.js',
          paths: Module._nodeModulePaths(base)
        });

        console.dir(req);

        // this will throw
        fn = require(req);
      }

    }else if(phase && phase === Object(phase)) {
      if(!phase.plugin || !(phase.plugin instanceof Function)) {
        throw new Error(
          'object middleware does not define plugin function'); 
      }
      detail = getDetail(phase.plugin);
      const fn = phase.plugin;
      delete phase.plugin;
      // use input object as configuration
      detail.conf = phase;
      return getClosure(fn, detail); 
    }

    if(fn.id) {
      // rewrite conf using specific id
      detail.conf = getDetail(fn.id).conf;
    }

    closure = fn(state, detail.conf);

    // closure returned an array of middleware to defer to 
    // so invoke each function
    if(Array.isArray(closure)) {
      let j
        , closures = [];
      for(j = 0;j < closure.length;j++) {
        closures = closures.concat(
          getClosure(closure[j], detail));
      }
      return closures;
    }

    return [closure];
  }

  for(i = 0;i < phases.length;i++) {
    phase = phases[i];

    if(!phase) {
      throw new Error(`invalid middleware plugin declaration`); 
    }

    detail = getDetail(phase);
    closures = closures.concat(getClosure(phase, detail));
  }

  closures.forEach((closure) => {
    middleware.push(closure);
  })

  return middleware;
}

module.exports = middleware;
