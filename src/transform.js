const SKATE = 'skate';
const DEFINE = 'define';

/**
 *  Iterate all javascript strings parsing to an AST and extracting 
 *  components definitions `skate.define()`.
 *
 *  @private
 */
function extract(result, opts, cb) {
  const babel = require('babel-core');

  result.js = result.js || [];

  // do not modify result object
  const js = result.js.slice();

  function next(err) {
    if(err) {
      return cb(err); 
    }

    const script = js.shift();
    if(!script) {
      return cb(null, result); 
    }

    const components = {};

    // find skate.define() component declarations in the AST
    function component(babel) {
      var t = babel.types;
      return {
        visitor: {
          CallExpression: (expr) => {
            if(!expr.node || !t.isCallExpression(expr.node)) {
              return; 
            }

            const callee = expr.node.callee;
            const args = expr.node.arguments;

            if(t.isMemberExpression(callee)
              && t.isIdentifier(callee.object)
              && callee.object.name === SKATE
              && t.isIdentifier(callee.property)
              && callee.property.name === DEFINE
              && t.isStringLiteral(args[0])) {

              // this is the component name string literal, ie: x-component-foo
              const name = args[0].value;

              // map the AST expression node by component tag name
              components[name] = expr;
            } 
          }
        }
      }
    }

    // use our plugin to gather component definitions in the AST
    const res = babel.transform(script.contents, {
      plugins: [component]
    });

    script.result = res;

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
function transform(result, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  extract(result, opts, cb);
}

module.exports = transform;
