const PREFIX = 'trucks-generator-';

/**
 *  Create default output file contents and run generator plugins.
 *
 *  @public {function} generate
 *  @param {Object} state compiler state.
 *  @param {Object} conf plugin configuration.
 *  @option {Array} [generators] list generator plugins to run.
 *
 *  @returns plugin closure.
 */
function generate(state, conf) {

  conf = state.options.generate || conf;

  let generators = state.options.generators || conf.generators || [];

  const closures = state.middleware(
    {
      phases: generators,
      prefix: PREFIX,
      lookup: state.options.conf.generators
    }
  );

  return function generator(state, cb) {
    const opts = state.options;

    let file;

    // configure defaults
    if(opts.html && !state.hasFile(opts.html)) {
      file = state.getFile(opts.html); 
      // concatenate all templates
      state.tree.getTemplates().forEach((tpl) => {
        file.append(tpl.contents);
      })
    }

    if(opts.css && !state.hasFile(opts.css)) {
      file = state.getFile(opts.css); 
      // concatenate all style contents
      state.tree.getStyles().forEach((style) => {
        if(style.isDocumentScope()) {
          file.append(style.contents);
        }
      })
    }

    if(opts.js && !state.hasFile(opts.js)) {
      file = state.getFile(opts.js); 
      // concatenate all javascript contents
      state.tree.getScripts().forEach((script) => {
        file.append(script.contents);
      })
    }

    // run middleware plugins
    state.each(
      closures,
      (fn, next) => {
        try {
          fn(state, next); 
        }catch(e) {
          next(e); 
        }
      },
      (err) => {
        if(err) {
          return cb(err); 
        }
        cb(null, state); 
      }
    );
  }
}

module.exports = generate;
