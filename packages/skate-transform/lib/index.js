'use strict';

/**
 *  Iterate all javascript strings parsing to an AST and extracting 
 *  components definitions `skate.define()`.
 *
 *  @private
 */
module.exports = function transform(state) {
  var options = state.options,
      compiler = require('./compiler')
  // configuration for id attribute replacement
  // which enables {{id}} to be replaced with the
  // <dom-module> element id
  ,
      id = options.compiler.id,
      replace = id && id.pattern instanceof RegExp;

  // setup the output file
  var file = state.getFile(options.js);

  // list of components processed
  var components = []
  // list of compiled template render functions
  // used for the final map
  ,
      templates = [];

  return {
    complete: function complete(cb) {

      var babel = require('babel-core'),
          hash = compiler.map(templates, options.compiler),
          entry = compiler.main(options.compiler);

      var map = void 0,
          main = void 0;

      // get the template map
      map = babel.transformFromAst(hash, options.babel);

      // get the template main function
      main = babel.transformFromAst(entry, options.babel);

      file.prepend(main.code);
      file.prepend(map.code);

      cb();
    },
    'Script': function Script(node, cb) {

      // perform {{id}} replacement
      if (replace && node && node.contents === String(node.contents)) {
        node.contents = node.contents.replace(id.pattern, node.parent.id);
      }
      file.append(node.contents);

      cb();
    },
    'Component': function Component(node, cb) {
      options.compiler.querySelectorAll = node.template.querySelectorAll;

      var res = compiler.render(node.template.element, options.compiler);
      templates.push(res);
      components.push(node);

      cb();
    }
  };
};

module.exports.compiler = require('./compiler');