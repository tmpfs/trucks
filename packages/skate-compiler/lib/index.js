'use strict';

/**
 *  Iterate all javascript strings parsing to an AST and extracting 
 *  components definitions `skate.define()`.
 *
 *  @private
 */
module.exports = function transform(state) {
  var opts = state.options;

  var file = void 0;

  // setup the output file
  if (opts.js && !state.hasFile(opts.js)) {
    file = state.getFile(opts.js);

    // concatenate all javascript contents
    //const scripts = state.result.scripts.map((script) => {
    //console.log(script);
    //return script.contents;
    //})

    //file.contents = scripts;
  }

  return {
    'Component': function Component(node, cb) {
      var mod = node.parent,
          compiler = require('./compiler'),
          babel = require('babel-core'),
          tpl = mod.templates;

      var html = '',
          compiled = null,
          transformed = null,
          map = '',
          main = '';

      // TODO: do not concatenate for compilation
      // TODO: pass a preparsed DOM of each template
      tpl.forEach(function (item) {
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

      //console.log(file.contents);

      cb();
    }
  };
};

module.exports.compiler = require('./compiler');