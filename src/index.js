const State = require('./state')
    , PREFIX = 'trucks-plugin-'
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
    , rc
    , config;

  if(opts.eol !== undefined && opts.eol !== String(opts.eol)) {
    return cb(new Error('eol option must be a string')); 
  }

  if(opts.rc === String(opts.rc)) {
    opts.rc = [opts.rc];
  }

  // list of rciguration files to require and merge
  if(Array.isArray(opts.rc)) {
    rc = opts.rc;
    delete opts.rc;

    let i, file;
    for(i = 0;i < rc.length;i++) {
      file = rc[i];
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

  // respect `transforms` shortcut option
  if(Array.isArray(options.transforms)) {
    options.conf.plugins.transform = 
      options.conf.plugins.transform || {};
    options.conf.plugins.transform.visitors = options.transforms.slice();
  }

  // re-assign modified options
  state.options = options;

  cb(null, state);
}

/**
 *  Compile component files to CSS, Javascript and HTML.
 *
 *  @function trucks
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {Array} files list of HTML files to compile.
 *  @option {Array|String} [rc] configuration files to load as options.
 *  @option {Object} [babel] options to pass to babel transform.
 *  @option {Boolean=false} [extract] do not compile templates, write to file.
 *  @option {Object} [trim] configure whitespace trim options.
 *  @option {String} [out] output directory for files.
 *  @option {String=components} [name] name of the output files.
 *  @option {String} [html] path to write the generated template markup.
 *  @option {String} [css] path to write the generated stylesheet.
 *  @option {String} [js] path to write the generated javascript.
 *  @option {Boolean} [force] overwrite files that already exist.
 *  @option {String} [eol] override the default EOL for concatenation.
 */
function trucks(opts, cb) {
  const state = new State(opts);

  options(state, (err) => {
    if(err) {
      return cb(err); 
    }

    let phases = Array.isArray(state.options.plugins)
          ? state.options.plugins : DEFAULTS;

    if(Array.isArray(state.options.before.plugins)) {
      phases = state.options.before.plugins.concat(phases);
    }

    if(Array.isArray(state.options.after.plugins)) {
      phases = phases.concat(state.options.after.plugins);
    }
    
    let closures;

    try {
      //console.log(state.options.conf.plugins);
      closures = state.getMiddleware(
        {
          phases: phases,
          prefix: PREFIX,
          lookup: state.options.conf.plugins
        });
    }catch(e) {
      return cb(e); 
    }

    state.each(
      closures,
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

PHASES.forEach((phase) => {
  trucks[phase.toUpperCase()] = phase;
})

module.exports = trucks;
