'use strict';

/**
 *  @private
 */
function generate(state, cb) {
  var opts = state.options || {},
      generated = state.result.generate || {};

  if (opts.eol !== undefined && opts.eol !== String(opts.eol)) {
    return cb(new Error('eol option must be a string'));
  }

  var EOL = require('os').EOL,
      eol = opts.eol || EOL + EOL;

  // concatenate all templates
  var templates = state.result.templates.map(function (tpl) {
    return tpl.contents;
  });
  generated.html = templates.join(eol);

  // concatenate all style contents
  var styles = state.result.styles.map(function (style) {
    return style.contents;
  });
  generated.stylesheet = styles.join(eol);

  // concatenate all javascript contents
  var js = state.result.scripts.map(function (script) {
    return script.code;
  });

  // got compiled code to prepend
  if (state.result.compiler && state.result.compiler.compiled && state.result.compiler.compiled.code) {
    js.unshift(state.result.compiler.compiled.code.main);
    js.unshift(state.result.compiler.compiled.code.map);
  }

  generated.javascript = js.join(eol);

  cb(null, state);
}

module.exports = generate;