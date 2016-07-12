'use strict';

var each = require('./each'),
    Tree = require('./component').Tree,
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
  // private list of middleware to execute
  this.middleware = [];

  // input options
  this.options = options || {};
  // list of input files
  this.files = options.files || [];

  var cheerio = require('cheerio');
  this.parser = {
    module: cheerio,
    parse: cheerio.load
  };

  // the component tree stucture
  this.tree = new Tree();

  this.list = [];

  // keep track of processed files during load phase
  this.seen = {
    imports: [],
    sources: []
  };

  this.result = {
    // list of all component files
    files: [],
    // lists of component modules
    modules: [],
    // javascript list of all templates
    templates: [],
    // javascript list of all styles
    styles: [],
    // javascript list of all scripts
    scripts: [],

    // compiler output AST structures
    compiler: {}
  };
}

function run(opts, cb) {
  var state = new CompilerState(opts);

  var i = void 0,
      phase = void 0,
      phases = Array.isArray(state.options.plugins) ? state.options.plugins : PHASES,
      middleware = state.middleware,
      closure = void 0;

  for (i = 0; i < phases.length; i++) {
    phase = phases[i];

    try {
      // assume plugin is middleware
      if (phase instanceof Function) {
        closure = phase(state);
      } else if (phase === String(phase)) {
        // see if the phase is a known built in plugin
        if (handlers[phase]) {
          // initialize result phases
          state.result[phase] = state.result[phase] || {};
          closure = handlers[phase](state);
          // treat as plugin module
        } else {
          closure = require(phase)(state);
        }
      }
    } catch (e) {
      return cb(e);
    }

    if (closure) {
      middleware.push(closure);
    }
  }

  each(middleware, function (err) {
    if (err) {
      return cb(err);
    }
    cb(null, state);
  }, [state]);
}

run.phases = PHASES;

module.exports = run;