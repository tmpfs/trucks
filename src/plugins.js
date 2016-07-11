const each = require('./each')
    , LOAD = 'load'
    , PARSE = 'parse'
    , TRANSFORM = 'transform'
    , GENERATE = 'generate'
    , WRITE = 'write'
    , PHASES = [
        LOAD,
        PARSE,
        TRANSFORM,
        GENERATE,
        WRITE
      ]

const handlers = {
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

function CompilerState(options) {
  // private list of middleware to execute
  this.middleware = [];

  // input options
  this.options = options || {};
  // list of input files
  this.files = options.files || [];

  const cheerio = require('cheerio');
  this.parser = {
    module: cheerio,
    parse: cheerio.load
  }

  this.result = {
    load: {
      files: [] 
    },
    parse: {
      css: [],
      js: [],
      tpl: []
    }
  };
}

function run(opts, cb) {
  const state = new CompilerState(opts);

  let i
    , phase
    , phases = Array.isArray(state.options.plugins)
        ? state.options.plugins : PHASES
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
  
    if(closure) {
      middleware.push(closure);
    }
  }
 
  each(middleware, (err) => {
    if(err) {
      return cb(err); 
    } 
    cb(null, state);
  }, [state]);
}

run.phases = PHASES;

module.exports = run;
