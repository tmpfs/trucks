'use strict';

/**
 *  @private
 */
function generate(input, cb) {
  var opts = input.options || {},
      transformed = input.result.transform,
      generated = input.result.generate || {};

  if (opts.eol !== undefined && opts.eol !== String(opts.eol)) {
    return cb(new Error('eol option must be a string'));
  }

  var EOL = require('os').EOL,
      eol = opts.eol || EOL + EOL;

  // concatenate all templates
  var templates = transformed.tpl.map(function (tpl) {
    return tpl.contents;
  });
  generated.html = templates.join(eol);

  // concatenate all style contents
  var styles = transformed.css.map(function (style) {
    return style.contents;
  });
  generated.stylesheet = styles.join(eol);

  // concatenate all javascript contents
  var js = transformed.js.map(function (script) {
    return script.code;
  });

  // got compiled code to prepend
  if (transformed.compiled && transformed.compiled.code) {
    js.unshift(transformed.compiled.code.main);
    js.unshift(transformed.compiled.code.map);
  }

  generated.javascript = js.join(eol);

  cb(null, input);
}

module.exports = generate;