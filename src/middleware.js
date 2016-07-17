/**
 *  Helper function to invoke middleware functions.
 *
 *  @private {function} middleware
 *
 *  @throws Error if the middleware function errors.
 */
function middleware(state, options /*phases, handlers*//*, prefix */) {
  let i
    , phases = options.phases
    , handlers = options.handlers
    , lookup = options.lookup || state.options.configuration
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
    }

    let conf = {};

    if(out.name) {
      if(lookup[out.name] && lookup[out.name] === Object(lookup[out.name])) {
        conf = lookup[out.name];
      } 
    }

    out.conf = conf;
    return out;
  }

  function getClosure(phase, detail) {
    let closure; 
    // assume plugin is middleware
    if(phase instanceof Function) {
      closure = phase(state, detail.conf);
    }else if(phase === String(phase)) {
      // see if the phase is a known built in plugin
      if(handlers[phase]) {
        closure = handlers[phase](state, detail.conf);
      // treat as plugin module 
      }else{
        closure = require(phase)(state, detail.conf);
      }
    }else if(phase && phase === Object(phase)) {
      if(!phase.plugin || !(phase.plugin instanceof Function)) {
        throw new Error('object middleware does not define plugin function'); 
      }
      detail = getDetail(phase.plugin);
      const fn = phase.plugin;
      delete phase.plugin;

      // use input object as configuration
      detail.conf = phase;

      return getClosure(fn, detail); 
    }

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
    detail = getDetail(phase);
    closures = closures.concat(getClosure(phase, detail));
  }

  closures.forEach((closure) => {
    middleware.push(closure);
  })

  return middleware;
}

module.exports = middleware;
