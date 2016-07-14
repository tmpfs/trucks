const each = require('./each')
    , State = require('./state')
    , SOURCES = 'sources'
    , LOAD = 'load'
    , PARSE = 'parse'
    , TRANSFORM = 'transform'
    , GENERATE = 'generate'
    , WRITE = 'write'
    // names for exposed constants
    , PHASES = [
        SOURCES,
        LOAD,
        PARSE,
        TRANSFORM,
        GENERATE,
        WRITE
      ]
    // default phases to use
    , DEFAULTS = [
        SOURCES,
        TRANSFORM,
        GENERATE,
        WRITE
      ];

const handlers = {
  sources: function() {
    return [
      require('./load'),
      require('./parse')
    ]; 
  },
  load: function() {
    return require('./load'); 
  },
  parse: function() {
    return require('./parse'); 
  },
  transform: function() {
    return require('./transform'); 
  },
  generate: function() {
    return require('./generate'); 
  },
  write: function() {
    return require('./write'); 
  }
}

function run(opts, cb) {
  const state = new State(opts);

  let i
    , phase
    , phases = Array.isArray(state.options.plugins)
        ? state.options.plugins : DEFAULTS
    , middleware = state.middleware
    , closure;

  for(i = 0;i < phases.length;i++) {
    phase = phases[i];
    try {
      // assume plugin is middleware
      if(phase instanceof Function) {
        closure = phase(state);
      }else if(phase === String(phase)) {
        // see if the phase is a known built in plugin
        if(handlers[phase]) {
          // initialize result phases
          state.result[phase] = state.result[phase] || {};
          closure = handlers[phase](state);
        // treat as plugin module 
        }else{
          closure = require(phase)(state);
        }
      }
    }catch(e) {
      return cb(e); 
    }
  
    if(closure instanceof Function) {
      middleware.push(closure);
    }else if(Array.isArray(closure)) {
      middleware.push(...closure); 
    }
  }
 
  each(
    middleware,
    (fn, next) => {
      fn(state, next);
    },
    (err) => {
      if(err) {
        return cb(err); 
      } 
      cb(null, state);
    }
  );
}

run.phases = PHASES;

module.exports = run;
