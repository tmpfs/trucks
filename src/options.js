function options(state, cb) {
  const abs = require('./absolute')
      , merge = require('merge')
  
  let opts = state.options
    , options = require('../defaults')
    , conf
    , config;

  opts = opts || {};

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

  // finally merge in passed options
  options = merge(true, options, opts);

  // re-assign modified options
  state.options = options;

  cb(null, state);
}

module.exports = options;
