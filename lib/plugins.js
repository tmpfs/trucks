'use strict';

var State = require('./state'),
    PREFIX = 'trucks-plugin-',
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
      rc = void 0,
      config = void 0;

  if (opts.eol !== undefined && opts.eol !== String(opts.eol)) {
    return cb(new Error('eol option must be a string'));
  }

  if (opts.rc === String(opts.rc)) {
    opts.rc = [opts.rc];
  }

  // list of rciguration files to require and merge
  if (Array.isArray(opts.rc)) {
    rc = opts.rc;
    delete opts.rc;

    var i = void 0,
        file = void 0;
    for (i = 0; i < rc.length; i++) {
      file = rc[i];
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

  // respect `transforms` shortcut option
  if (Array.isArray(options.transforms)) {
    options.conf.plugins.transform = options.conf.plugins.transform || {};
    options.conf.plugins.transform.visitors = options.transforms.slice();
  }

  // re-assign modified options
  state.options = options;

  cb(null, state);
}

function run(opts, cb) {
  var state = new State(opts);

  options(state, function (err) {
    if (err) {
      return cb(err);
    }

    var phases = Array.isArray(state.options.plugins) ? state.options.plugins : DEFAULTS;

    var closures = void 0;

    try {
      closures = state.getMiddleware({
        phases: phases,
        prefix: PREFIX,
        lookup: state.options.conf.plugins
      });
    } catch (e) {
      return cb(e);
    }

    state.each(closures, function (fn, next) {
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