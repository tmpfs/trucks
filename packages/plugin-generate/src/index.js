const PREFIX = 'trucks-generator-';

function generate(state, conf) {

  let generators = state.options.generators || conf.generators || [];

  const closures = state.middleware(
    {
      phases: generators,
      prefix: PREFIX,
      lookup: state.options.conf.generators
    }
  );

  //console.dir(closures);

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
        fn(next); 
      },
      (err) => {
        if(err) {
          return cb(err); 
        }
        cb(null, state); 
      }
    );

    //cb(null, state);
  }
}

module.exports = generate;
