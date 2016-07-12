/**
 *  @private
 */
function generate(state, cb) {
  const opts = state.options || {}
    , generated = state.result.generate || {};

  if(opts.eol !== undefined && opts.eol !== String(opts.eol)) {
    return cb(new Error('eol option must be a string')); 
  }

  const EOL = require('os').EOL
      , eol = opts.eol || (EOL + EOL);

  // concatenate all templates
  const templates = state.result.templates.map((tpl) => {
    return tpl.contents;
  })
  generated.html = templates.join(eol);

  // concatenate all style contents
  const styles = state.result.styles.map((style) => {
    return style.contents;
  })
  generated.stylesheet = styles.join(eol);

  // concatenate all javascript contents
  const js = state.result.scripts.map((script) => {
    return script.code;
  })

  // got compiled code to prepend
  if(state.result.compiler
    && state.result.compiler.compiled
    && state.result.compiler.compiled.code) {
    js.unshift(state.result.compiler.compiled.code.main);
    js.unshift(state.result.compiler.compiled.code.map);
  }

  generated.javascript = js.join(eol);

  cb(null, state);
}

module.exports = generate;
