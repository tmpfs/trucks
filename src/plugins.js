const State = require('./state')
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
      ]
    , NAME = 'components'
    , HTML = 'html'
    , CSS = 'css'
    , JS = 'js';

function options(state, cb) {
  const abs = state.absolute
      , merge = require('merge')
  
  let opts = state.options
    , options = require('../defaults')
    , conf
    , config;

  if(opts.eol !== undefined && opts.eol !== String(opts.eol)) {
    return cb(new Error('eol option must be a string')); 
  }

  if(opts.conf === String(opts.conf)) {
    opts.conf = [opts.conf];
  }

  // list of configuration files to require and merge
  if(Array.isArray(opts.conf)) {
    conf = opts.conf;
    delete opts.conf;

    let i, file;
    for(i = 0;i < conf.length;i++) {
      file = conf[i];
      file = abs(file);
      try {
        config = require(file);
        options = merge(true, options, config);
      }catch(e) {
        return cb(e); 
      }
    }
  }

  // merge in passed options after loading config files
  options = merge(true, options, opts);

  let html
    , css
    , js;

  // set up output directory and file names
  if(options.out === String(options.out)) {
    options.name = options.name || NAME;

    // build output paths using `out` directory and `name` options
    html = abs(`${options.name}.${HTML}`, options.out);
    css = abs(`${options.name}.${CSS}`, options.out);
    js = abs(`${options.name}.${JS}`, options.out);
  }

  // specific overrides for each output type
  if(html && !options.html) {
    options.html = html;
  }
  if(css && !options.css) {
    options.css = css;
  }
  if(js && !options.js) {
    options.js = js;
  }

  // plugin configuration objects
  options.configuration = options.configuration || {};

  // respect `transforms` shortcut option
  if(Array.isArray(options.transforms)) {
    options.configuration.transform = options.configuration.transform || {};
    options.configuration.transform.visitors = 
      options.configuration.transform.visitors  || [];

    options.transforms.forEach((transform) => {
      options.configuration.transform.visitors.push(transform); 
    })
  }

  // re-assign modified options
  state.options = options;

  cb(null, state);
}

function getHandlers() {
  return {
    sources: function sources() {
      return [
        require('./plugins/load'),
        require('./plugins/parse')
      ]; 
    },
    load: require('./plugins/load'),
    parse: require('./plugins/parse'),
    transform: require('./plugins/transform'),
    generate: require('./plugins/generate'),
    write: require('./plugins/write')
  }
}

function run(opts, cb) {
  const state = new State(opts)
    , handlers = getHandlers();

  options(state, (err) => {
    if(err) {
      return cb(err); 
    }

    let i
      , phase
      , conf
      , detail
      , phases = Array.isArray(state.options.plugins)
          ? state.options.plugins : DEFAULTS
      , middleware = state.middleware
      , closures = [];

    function getDetail(phase) {
      const out = {}; 
      if(phase === String(phase)) {
        out.name = phase; 
      }else if(phase instanceof Function) {
        out.name = phase.name; 
      }
      conf = state.options.configuration[out.name] || {};
      out.conf = conf;
      return out;
    }

    function getClosure(phase, detail) {
      let closure; 
      // assume plugin is middleware
      if(phase instanceof Function) {
        closure = phase(detail.conf, state);
      }else if(phase === String(phase)) {
        // see if the phase is a known built in plugin
        if(handlers[phase]) {
          closure = handlers[phase](detail.conf, state);
        // treat as plugin module 
        }else{
          closure = require(phase)(detail.conf, state);
        }
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
      try {
        closures = closures.concat(getClosure(phase, detail));
      }catch(e) {
        return cb(e); 
      }
    }

    closures.forEach((closure) => {
      middleware.push(closure);
    })
   
    state.each(
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
  });

  return state;
}

run.phases = PHASES;

module.exports = run;
