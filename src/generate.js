const EOL = require('os').EOL;

/**
 *  @private
 */
function generate(result, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  // concatenate all style contents
  const styles = result.css.map((style) => {
    return style.contents;
  })
  result.stylesheet = styles.join(EOL);

  // concatenate all javascript contents
  const js = result.js.map((script) => {
    return script.code;
  })
  result.javascript = js.join(EOL);

  cb(null, result);
}

module.exports = generate;
