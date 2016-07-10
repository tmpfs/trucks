'use strict';

var each = require('./each'),
    LOAD = 'load',
    PARSE = 'parse',
    TRANSFORM = 'transform',
    GENERATE = 'generate',
    WRITE = 'write',
    PHASES = [LOAD, PARSE, TRANSFORM, GENERATE, WRITE];

var handlers = {
  load: function load() {
    return require('./load');
  },
  parse: function parse() {
    return require('./parse');
  },
  transform: function transform() {
    return require('./transform');
  },
  generate: function generate() {
    return require('./generate');
  },
  write: function write() {
    return require('./write');
  }
};

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
  var state = new CompilerState(opts);

  var i = void 0,
      phase = void 0,
      list = [],
      phases = Array.isArray(state.options.plugins) ? state.options.plugins : PHASES;

  for (i = 0; i < phases.length; i++) {
    phase = phases[i];
    if (handlers[phase]) {
      // initialize result phases
      state.result[phase] = state.result[phase] || {};
      try {

        // call the handler function which can return
        // a module function or closure function
        list.push(handlers[phase]());
      } catch (e) {
        return cb(e);
      }
    }
  }

  each(list, function (err) {
    if (err) {
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