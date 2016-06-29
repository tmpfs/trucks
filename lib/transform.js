'use strict';

var SKATE = 'skate';
var DEFINE = 'define';

/**
 *  Iterate all javascript strings parsing to an AST and extracting 
 *  components definitions `skate.define()`.
 *
 *  @private
 */
function defs(result, cb) {
  var babel = require('babel-core');

  result.js = result.js || [];

  // do not modify result object
  var js = result.js.slice();

  function next(err) {
    if (err) {
      return cb(err);
    }

    var script = js.shift();
    if (!script) {
      return cb();
    }

    var components = {};

    // find skate.define() component declarations in the AST
    function component(babel) {
      var t = babel.types;
      return {
        visitor: {
          CallExpression: function CallExpression(expr) {
            if (!expr.node || !t.isCallExpression(expr.node)) {
              return;
            }

            var callee = expr.node.callee;
            var args = expr.node.arguments;

            if (t.isMemberExpression(callee) && t.isIdentifier(callee.object) && callee.object.name === SKATE && t.isIdentifier(callee.property) && callee.property.name === DEFINE && t.isStringLiteral(args[0])) {

              // this is the component name string literal, ie: x-component-foo
              var name = args[0].value;

              // map the AST expression node by component tag name
              components[name] = expr;
            }
          }
        }
      };
    }

    // use our plugin to gather component definitions in the AST
    var res = babel.transform(script.contents, {
      plugins: [component]
    });

    script.res = res;

    // inject list of components defined by each script
    script.components = components;

    next();
  }

  next();
}

function transform(result, cb) {
  defs(result, cb);
}

module.exports = transform;