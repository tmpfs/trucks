/**
 *  @private
 */
function generate(state, cb) {
  const opts = state.options || {};

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
    const styles = state.result.styles.map((style) => {
      return style.contents;
    })
    file = state.getFile(opts.css); 
    file.contents = styles;
  }

  if(opts.js && !state.hasFile(opts.js)) {
    // concatenate all javascript contents
    const scripts = state.result.scripts.map((script) => {
      return script.code;
    })

    file = state.getFile(opts.js); 
    file.contents = scripts;

    // TODO: move this logic to compiler plugin

    // got compiled code to prepend
    if(state.result.compiler
      && state.result.compiler.compiled
      && state.result.compiler.compiled.code) {
      file.prepend(state.result.compiler.compiled.code.main);
      file.prepend(state.result.compiler.compiled.code.map);
    }
  }

  cb(null, state);
}

module.exports = generate;
