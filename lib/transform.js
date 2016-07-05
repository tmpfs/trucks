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

    script.code = script.contents;

    // extracting HTML templates verbatim
    // bypass transform/compile phase
    if (opts.extract) {
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

    next();
  }

  next();
}

/**
 *  Test for duplicate template identifiers.
 *
 *  @private {function} duplicates
 *  @param {Array} templates list of loaded templates.
 *  @param {Object} opts processing options.
 *
 *  @throws Error if a duplicate template identifier is found.
 */
function duplicates(templates, opts) {
  // TODO: parsing of the template DOM could be done in
  // TODO: the parse phase and the compiler could be modified to
  // TODO: to accept the existing DOM element which would optimize
  // TODO: the number of calls to cheerio.load() for templates.
  // TODO: it would remove this call to cheerio.load() and the call
  // TODO: in the compiler

  var cheerio = require('cheerio');
  var i = void 0,
      tpl = void 0,
      $ = void 0,
      id = void 0,
      elements = void 0,
      identifiers = [];

  function iterator() {
    id = $(this).attr(opts.compiler.attr);
    if (~identifiers.indexOf(id)) {
      throw new Error('duplicate template identifier: ' + id + ' (' + tpl.file + ')');
    }
    identifiers.push(id);
  }

  for (i = 0; i < templates.length; i++) {
    tpl = templates[i];
    $ = cheerio.load(tpl.contents);
    elements = $(opts.selectors.templates);
    elements.each(iterator);
  }
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

  parsed.tpl = parsed.tpl || [];

  try {
    duplicates(parsed.tpl, opts);
  } catch (e) {
    return cb(e);
  }

  extract(parsed, opts, function (err) {
    if (err) {
      return cb(err);
    }

    // only compile templates when not extracting
    if (!opts.extract) {

      // list of template elements encountered
      var tpl = parsed.tpl,
          compiler = require('./compile'),
          babel = require('babel-core');

      // create HTML string of all templates
      var html = '',
          compiled = null,
          transformed = null,
          map = '',
          main = '';

      tpl.forEach(function (item) {
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
      };

      // inject compiler result object
      parsed.compiled = compiled;
    }

    cb(null, parsed);
  });
}

module.exports = transform;