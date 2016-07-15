const NAME = 'components'
    , HTML = 'html'
    , CSS = 'css'
    , JS = 'js';

function options(state, cb) {
  const abs = require('./absolute')
      , merge = require('merge')
  
  let opts = state.options
    , options = require('../defaults')
    , conf
    , config;

  opts = opts || {};

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

  // re-assign modified options
  state.options = options;

  cb(null, state);
}

module.exports = options;
