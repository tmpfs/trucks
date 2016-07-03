const EOL = require('os').EOL;

/**
 *  @private
 */
function generate(transformed, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts = opts || {};

  if(opts.eol !== undefined && typeof opts.eol !== 'string') {
    return cb(new Error('eol option must be a string')); 
  }

  // concatenate all templates
  const templates = transformed.tpl.map((tpl) => {
    return tpl.contents;
  })
  transformed.html = templates.join(opts.eol || EOL);

  // concatenate all style contents
  const styles = transformed.css.map((style) => {
    return style.contents;
  })
  transformed.stylesheet = styles.join(opts.eol || EOL);

  // concatenate all javascript contents
  const js = transformed.js.map((script) => {
    return script.code;
  })

  // got compiled code to prepend
  if(transformed.compiled && transformed.compiled.code) {
    js.unshift(transformed.compiled.code.main);
    js.unshift(transformed.compiled.code.map);
  }

  transformed.javascript = js.join(opts.eol || EOL);

  cb(null, transformed);
}

module.exports = generate;
