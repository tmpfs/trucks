'use strict';

var EOL = require('os').EOL;

/**
 *  @private
 */
function generate(transformed, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts = opts || {};

  if (opts.eol !== undefined && opts.eol !== String(opts.eol)) {
    return cb(new Error('eol option must be a string'));
  }

  var eol = opts.eol || EOL + EOL;

  // concatenate all templates
  var templates = transformed.tpl.map(function (tpl) {
    return tpl.contents;
  });
  transformed.html = templates.join(opts.eol || EOL);

  // concatenate all style contents
  var styles = transformed.css.map(function (style) {
    return style.contents;
  });
  transformed.stylesheet = styles.join(opts.eol || EOL);

  // concatenate all javascript contents
  var js = transformed.js.map(function (script) {
    return script.code;
  });

  // got compiled code to prepend
  if (transformed.compiled && transformed.compiled.code) {
    js.unshift(transformed.compiled.code.main);
    js.unshift(transformed.compiled.code.map);
  }

  transformed.javascript = js.join(eol);

  cb(null, transformed);
}

module.exports = generate;