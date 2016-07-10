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
  // input options
  this.options = options || {};
  // list of input files
  this.files = options.files || [];

  // array of loaded objects
  //this.fileMap = {};

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
    , list = []
    , phases = Array.isArray(state.options.phases)
        ? state.options.phases : PHASES;

  for(i = 0;i < phases.length;i++) {
    phase = phases[i];
    if(handlers[phase]) {
      // initialize result phases
      state.result[phase] = state.result[phase] || {};
      try {

        // call the handler function which can return
        // a module function or closure function
        list.push(handlers[phase]());
      }catch(e) {
        return cb(e); 
      }
    }
  }
 
  each(list, (err) => {
    if(err) {
      return cb(err); 
    } 
    cb(null, state);
  }, [state]);
}

run.phases = PHASES;

//run.phases = {
  //LOAD: LOAD,
  //PARSE: PARSE,
  //TRANSFORM: TRANSFORM,
  //GENERATE: GENERATE,
  //WRITE: WRITE
//}

module.exports = run;
