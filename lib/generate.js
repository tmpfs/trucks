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

  // concatenate all style contents
  var styles = transformed.css.map(function (style) {
    return style.contents;
  });
  transformed.stylesheet = styles.join(opts.eol || EOL);

  // concatenate all javascript contents
  var js = transformed.js.map(function (script) {
    return script.code;
  });
  transformed.javascript = js.join(opts.eol || EOL);

  cb(null, transformed);
}

module.exports = generate;