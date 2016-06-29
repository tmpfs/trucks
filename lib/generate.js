'use strict';

var EOL = require('os').EOL;

function generate(result, cb) {

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