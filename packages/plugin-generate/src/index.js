function generate(/*state, conf*/) {

  return function generator(state, cb) {
    const opts = state.options;

    let file;

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

    cb(null, state);
  }
}

module.exports = generate;
