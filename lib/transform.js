'use strict';

var SKATE = 'skate',
    DEFINE = 'define';

/**
 *  Iterate all javascript strings parsing to an AST and extracting 
 *  components definitions `skate.define()`.
 *
 *  @private
 */
function extract(result, opts, cb) {
  var babel = require('babel-core');

  result.js = result.js;

  // do not modify result object
  var js = result.js.slice();

  function next() {

    var script = js.shift();
    if (!script) {
      return cb(null, result);
    }

    // extracting HTML templates verbatim
    // bypass transform/compile phase
    if (opts.extract) {
      script.code = script.contents;
      return next();
    }

    var components = {};
    var count = 0;

    // find skate.define() component declarations in the AST
    function component(babel) {
      var t = babel.types;
      return {
        visitor: {
          CallExpression: function CallExpression(expr) {
            var callee = expr.node.callee;
            var args = expr.node.arguments;

            if (t.isMemberExpression(callee) && t.isIdentifier(callee.object) && callee.object.name === SKATE && t.isIdentifier(callee.property) && callee.property.name === DEFINE && t.isStringLiteral(args[0])) {

              // this is the component name string literal, ie: x-component-foo
              var name = args[0].value;

              // map the AST expression node by component tag name
              components[name] = expr;

              count++;
            }
          }
        }
      };
    }

    var options = opts.babel;

    options.plugins = Array.isArray(options.plugins) ? options.plugins : [];

    // use our plugin to gather component definitions in the AST
    options.plugins.unshift(component);

    // inject file name for compiler errors
    options.filename = script.file;

    var res = void 0;

    try {
      res = babel.transform(script.contents, options);
    } catch (e) {
      return cb(e);
    }

    script.result = res;

    // no components defined, ie: `skate.define()` not called
    if (!count) {
      return cb(new Error(script.file + ' does not define a component'));
    }

    // inject list of components defined by each script
    script.components = components;

    // FIXME: needs to point to the transformed javascript code
    // FIXME: using original source for now
    script.code = res.code;

    next();
  }

  next();
}

/**
 *  @private
 */
function transform(parsed, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts = opts || {};
  opts.babel = opts.babel || {};

  extract(parsed, opts, cb);
}

module.exports = transform;