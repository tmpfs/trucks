/**
 *  @private
 */
function generate(input, cb) {
  const opts = input.options || {}
    , transformed = input.result.transform
    , generated = input.result.generate || {};

  if(opts.eol !== undefined && opts.eol !== String(opts.eol)) {
    return cb(new Error('eol option must be a string')); 
  }

  const EOL = require('os').EOL
      , eol = opts.eol || (EOL + EOL);

  // concatenate all templates
  const templates = transformed.tpl.map((tpl) => {
    return tpl.contents;
  })
  generated.html = templates.join(eol);

  // concatenate all style contents
  const styles = transformed.css.map((style) => {
    return style.contents;
  })
  generated.stylesheet = styles.join(eol);

  // concatenate all javascript contents
  const js = transformed.js.map((script) => {
    return script.code;
  })

  // got compiled code to prepend
  if(transformed.compiled && transformed.compiled.code) {
    js.unshift(transformed.compiled.code.main);
    js.unshift(transformed.compiled.code.map);
  }

  generated.javascript = js.join(eol);

  cb(null, input);
}

module.exports = generate;
