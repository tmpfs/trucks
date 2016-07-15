/**
 *  Iterate all javascript strings parsing to an AST and extracting 
 *  components definitions `skate.define()`.
 *
 *  @private
 */
module.exports = function transform(state) {
  const opts = state.options;

  let file;

  // setup the output file
  if(opts.js && !state.hasFile(opts.js)) {
    file = state.getFile(opts.js); 

    // concatenate all javascript contents
    //const scripts = state.result.scripts.map((script) => {
      //console.log(script);
      //return script.contents;
    //})

    //file.contents = scripts;
  }

  return {
    'Component': function(node, cb) {
      const mod = node.parent
          , compiler = require('../compile')
          , babel = require('babel-core')
          , tpl = mod.templates;

      let html = ''
        , compiled = null
        , transformed = null
        , map = ''
        , main = '';

      // TODO: do not concatenate for compilation
      // TODO: pass a preparsed DOM of each template
      tpl.forEach((item) => {
        html += item.contents; 
      });

      compiled = compiler(html, opts.compiler);

      // get string code for the template map
      transformed = babel.transformFromAst(compiled.map, opts.babel);
      map = transformed.code;

      // get string code for the template main function
      transformed = babel.transformFromAst(compiled.main, opts.babel);
      main = transformed.code;

      file.prepend(main);
      file.prepend(map);

      console.log(file.contents);

      cb();
    }
  }
}
