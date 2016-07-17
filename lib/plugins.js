'use strict';

var State = require('./state'),
    SOURCES = 'sources',
    LOAD = 'load',
    PARSE = 'parse',
    TRANSFORM = 'transform',
    GENERATE = 'generate',
    WRITE = 'write'
// names for exposed constants
,
    PHASES = [SOURCES, LOAD, PARSE, TRANSFORM, GENERATE, WRITE]
// default phases to use
,
    DEFAULTS = [SOURCES, TRANSFORM, GENERATE, WRITE],
    NAME = 'components',
    HTML = 'html',
    CSS = 'css',
    JS = 'js';

function options(state, cb) {
  var abs = state.absolute,
      merge = require('merge');

  var opts = state.options,
      options = require('../defaults'),
      conf = void 0,
      config = void 0;

  if (opts.eol !== undefined && opts.eol !== String(opts.eol)) {
    return cb(new Error('eol option must be a string'));
  }

  if (opts.conf === String(opts.conf)) {
    opts.conf = [opts.conf];
  }

  // list of configuration files to require and merge
  if (Array.isArray(opts.conf)) {
    conf = opts.conf;
    delete opts.conf;

    var i = void 0,
        file = void 0;
    for (i = 0; i < conf.length; i++) {
      file = conf[i];
      file = abs(file);
      try {
        config = require(file);
        options = merge(true, options, config);
      } catch (e) {
        return cb(e);
      }
    }
  }

  // merge in passed options after loading config files
  options = merge(true, options, opts);

  var html = void 0,
      css = void 0,
      js = void 0;

  // set up output directory and file names
  if (options.out === String(options.out)) {
    options.name = options.name || NAME;

    // build output paths using `out` directory and `name` options
    html = abs(options.name + '.' + HTML, options.out);
    css = abs(options.name + '.' + CSS, options.out);
    js = abs(options.name + '.' + JS, options.out);
  }

  // specific overrides for each output type
  if (html && !options.html) {
    options.html = html;
  }
  if (css && !options.css) {
    options.css = css;
  }
  if (js && !options.js) {
    options.js = js;
  }

  // plugin configuration objects
  options.configuration = options.configuration || {};

  // respect `transforms` shortcut option
  if (Array.isArray(options.transforms)) {
    options.configuration.transform = options.configuration.transform || {};
    options.configuration.transform.visitors = options.configuration.transform.visitors || [];

    options.transforms.forEach(function (transform) {
      options.configuration.transform.visitors.push(transform);
    });
  }

  // re-assign modified options
  state.options = options;

  cb(null, state);
}

function getHandlers() {
  return {
    sources: function sources() {
      return [require('./plugins/load'), require('./plugins/parse')];
    },
    load: require('./plugins/load'),
    parse: require('./plugins/parse'),
    transform: require('./plugins/transform'),
    generate: require('./plugins/generate'),
    write: require('./plugins/write')
  };
}

function run(opts, cb) {
  var state = new State(opts),
      handlers = getHandlers();

  options(state, function (err) {
    if (err) {
      return cb(err);
    }

    var i = void 0,
        phase = void 0,
        conf = void 0,
        detail = void 0,
        phases = Array.isArray(state.options.plugins) ? state.options.plugins : DEFAULTS,
        middleware = state.middleware,
        closures = [];

    function getDetail(phase) {
      var out = {};
      if (phase === String(phase)) {
        out.name = phase;
      } else if (phase instanceof Function) {
        out.name = phase.name;
      }
      conf = state.options.configuration[out.name] || {};
      out.conf = conf;
      return out;
    }

    function getClosure(phase, detail) {
      var closure = void 0;
      // assume plugin is middleware
      if (phase instanceof Function) {
        closure = phase(state, detail.conf);
      } else if (phase === String(phase)) {
        // see if the phase is a known built in plugin
        if (handlers[phase]) {
          closure = handlers[phase](state, detail.conf);
          // treat as plugin module
        } else {
          closure = require(phase)(state, detail.conf);
        }
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
      }
      return [closure];
    }

    for (i = 0; i < phases.length; i++) {
      phase = phases[i];
      detail = getDetail(phase);
      try {
        closures = closures.concat(getClosure(phase, detail));
      } catch (e) {
        return cb(e);
      }
    }

    closures.forEach(function (closure) {
      middleware.push(closure);
    });

    state.each(middleware, function (fn, next) {
      fn(state, next);
    }, function (err) {
      if (err) {
        return cb(err);
      }
      cb(null, state);
    });
  });

  return state;
}

run.phases = PHASES;

module.exports = run;