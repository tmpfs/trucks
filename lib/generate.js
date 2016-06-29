'use strict';

var EOL = require('os').EOL;

/**
 *  @private
 */
function generate(result, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  // concatenate all style contents
  var styles = result.css.map(function (style) {
    return style.contents;
  });
  result.stylesheet = styles.join(EOL);

  // concatenate all javascript contents
  var js = result.js.map(function (script) {
    return script.code;
  });
  result.javascript = js.join(EOL);

  cb(null, result);
}

module.exports = generate;