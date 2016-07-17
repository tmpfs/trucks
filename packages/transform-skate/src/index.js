/**
 *  Iterate all javascript strings parsing to an AST and extracting 
 *  components definitions `skate.define()`.
 *
 *  @private
 */
module.exports = function skate(state, conf) {

  conf.id = conf.id || {
    pattern: /\{\{id\}\}/gm
  }

  const options = state.options
      , compiler = require('./compiler')
      // configuration for id attribute replacement
      // which enables {{id}} to be replaced with the
      // <dom-module> element id
      , id = conf.id
      , replace = (id && id.pattern instanceof RegExp);

  // setup the output file
  let file = state.getFile(options.js);

  // list of components processed
  let components = []
    // list of compiled template render functions
    // used for the final map
    , templates = [];

  return {
    end: function(tree, cb) {

      const babel = require('babel-core')
        , hash = compiler.map(templates, conf)
        , entry = compiler.main(conf);

      let map
        , main;

      // get the template map
      map = babel.transformFromAst(hash, options.babel);

      // get the template main function
      main = babel.transformFromAst(entry, options.babel);

      file.prepend(main.code);
      file.prepend(map.code);

      cb();
    },
    'Script': function(node, cb) {

      // perform {{id}} replacement
      if(replace && node && node.contents === String(node.contents)) {
        node.contents = node.contents.replace(id.pattern, node.parent.id); 
      }
      file.append(node.contents);

      cb();
    },
    'Component': function(node, cb) {
      conf.querySelectorAll = node.template.querySelectorAll;

      let res = compiler.render(node.template.element, conf);
      templates.push(res);
      components.push(node); 

      cb();
    }
  }
}

module.exports.compiler = require('./compiler');
