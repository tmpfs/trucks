function generate(/*state, conf*/) {

  return function generate(state, cb) {
    const opts = state.options;

    let file;

    if(opts.html && opts.extract && !state.hasFile(opts.html)) {
      // concatenate all templates
      const templates = state.result.templates.map((tpl) => {
        return tpl.contents;
      })
      file = state.getFile(opts.html); 
      file.contents = templates;
    }

    if(opts.css && !state.hasFile(opts.css)) {
      // concatenate all style contents
      const styles = state.tree.getStyles().map((style) => {
        if(style.isDocumentScope()) {
          return style.contents;
        }
      })
      file = state.getFile(opts.css); 
      file.contents = styles;
    }

    if(opts.js && !state.hasFile(opts.js)) {
      // concatenate all javascript contents
      const scripts = state.tree.getScripts().map((script) => {
        return script.contents;
      })

      file = state.getFile(opts.js); 
      file.contents = scripts;
    }

    cb(null, state);
  }
}

module.exports = generate;
