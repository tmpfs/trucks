const SKATE = 'skate'
    , DEFINE = 'define';

/**
 *  Iterate all javascript strings parsing to an AST and extracting 
 *  components definitions `skate.define()`.
 *
 *  @private
 */
function extract(state, output, cb) {
  const babel = require('babel-core')
    , opts = state.options || {};

  // do not modify result object
  const list = state.result.scripts
      , js = list.slice();

  function next() {

    const script = js.shift();
    if(!script) {
      return cb(null, list); 
    }

    script.code = script.contents;

    // extracting HTML templates verbatim
    // bypass transform/compile phase
    if(opts.extract) {
      return next(); 
    }

    const components = {};
    let count = 0;

    // find skate.define() component declarations in the AST
    function component(babel) {
      var t = babel.types;
      return {
        visitor: {
          CallExpression: (expr) => {
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

              count++;
            } 
          }
        }
      }
    }

    const options = opts.babel || {};

    options.plugins = Array.isArray(options.plugins) ? options.plugins : [];

    // use our plugin to gather component definitions in the AST
    options.plugins.unshift(component);

    // inject file name for compiler errors
    options.filename = script.file;

    let res;
    
    try {
      res = babel.transform(script.contents, options);
    }catch(e) {
      return cb(e); 
    }

    script.result = res;

    // no components defined, ie: `skate.define()` not called
    if(!count) {
      return cb(new Error(`${script.file} does not define a component`)); 
    }

    // inject list of components defined by each script
    script.components = components;

    next();
  }

  next();
}

/**
 *  Test for duplicate template identifiers.
 *
 *  @private {function} duplicates
 *  @param {Array} templates list of loaded templates.
 *
 *  @throws Error if a duplicate template identifier is found.
 */
function duplicates(templates) {
  const identifiers = [];
  let i
    , tpl
    , id;

  for(i = 0;i < templates.length;i++) {
    tpl = templates[i];
    id = tpl.id;
    if(~identifiers.indexOf(id)) {
      throw new Error(
        `duplicate template identifier ${id} in ${tpl.parent.file}`); 
    }
    identifiers.push(id);
  }
}

/**
 *  @private
 */
function transform(state, cb) {
  const opts = state.options || {}
    , result = state.result.compiler || {};

  opts.babel = opts.babel || {};

  try {
    duplicates(state.result.templates);
  }catch(e) {
    return cb(e); 
  }

  extract(state, result, function(err) {
    if(err) {
      return cb(err); 
    } 

    // only compile templates when not extracting
    if(!opts.extract) {

      // list of template elements encountered
      const tpl = state.result.templates
        , compiler = require('./compile')
        , babel = require('babel-core');

      // create HTML string of all templates
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

      // inject string code so that the generate phase 
      // can prepend the compiled code
      compiled.code = {
        map: map,
        main: main
      }

      // inject compiler result object
      result.compiled = compiled;
    }

    cb(null, state);
  });
}

module.exports = transform;
