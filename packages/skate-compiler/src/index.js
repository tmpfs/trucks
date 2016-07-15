const compiler = require('./compiler')
/**
 *  Iterate all javascript strings parsing to an AST and extracting 
 *  components definitions `skate.define()`.
 *
 *  @private
 */
module.exports = function transform(state) {
  const opts = state.options;

  opts.compiler = opts.compiler || {};

  // configuration for id attribute replacement
  // which enables {{id}} to be replaced with the
  // <dom-module> element id
  const id = {
    pattern: /\{\{id\}\}/gm
  }

  // setup the output file
  let file;
  if(opts.js && !state.hasFile(opts.js)) {
    file = state.getFile(opts.js); 
  }

  // list of components processed
  let components = []
    // list of compiled template render functions
    // used for the final map
    , templates = [];

  return {
    complete: function(cb) {

      const babel = require('babel-core')
        , hash = compiler.map(templates, opts.compiler)
        , entry = compiler.main(opts.compiler);

      let map
        , main;

      // get the template map
      map = babel.transformFromAst(hash, opts.babel);

      // get the template main function
      main = babel.transformFromAst(entry, opts.babel);

      file.prepend(main.code);
      file.prepend(map.code);

      cb();
    },
    'Script': function(node, cb) {

      console.log('got script...');

      // perform {{id}} replacement
      if(node && node.contents === String(node.contents)) {
        node.contents = node.contents.replace(id.pattern, node.parent.id); 
      }
      file.append(node.contents);

      cb();
    },
    'Component': function(node, cb) {
      opts.compiler.querySelectorAll = node.template.querySelectorAll;

      let res = compiler.render(node.template.element, opts.compiler);
      templates.push(res);
      components.push(node); 

      cb();
    }
  }
}

module.exports.compiler = require('./compiler');
