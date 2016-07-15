/**
 *  Iterate all javascript strings parsing to an AST and extracting 
 *  components definitions `skate.define()`.
 *
 *  @private
 */
module.exports = function transform(state) {
  const opts = state.options;

  // setup the output file
  let file;
  if(opts.js && !state.hasFile(opts.js)) {
    file = state.getFile(opts.js); 
  }

  let components = [];

  return {
    complete: function(cb) {

      state.each(
        components,
        (node, next) => {
        
          const mod = node.parent
              , compiler = require('./compiler')
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

          compiled = compiler.html(html, opts.compiler);

          // get string code for the template map
          transformed = babel.transformFromAst(compiled.map, opts.babel);
          map = transformed.code;

          // get string code for the template main function
          transformed = babel.transformFromAst(compiled.main, opts.babel);
          main = transformed.code;

          file.prepend(main);
          file.prepend(map);

          // compile next component
          next();
        }, cb);
    },
    'Script': function(node, cb) {
      const mod = node.parent;

      // perform {{id}} replacement
      if(node
        && node.contents === String(node.contents)
        && opts.id
        && opts.id.replace
        && (opts.id.pattern instanceof RegExp)) {

        node.contents = node.contents.replace(
          opts.id.pattern, mod.id); 
      }

      file.append(node.contents);
      cb();
    },
    'Component': function(node, cb) {
      components.push(node); 
      cb();
    }
  }
}

module.exports.compiler = require('./compiler');
