'use strict';

var TAG = 'tag',
    ID = 'id',
    SKATE = 'skate',
    VDOM = 'vdom',
    RENDER = 'render',
    ELEM = 'elem',
    ELEMENT = 'element',
    TEXT = 'text';

/**
 *  Utility to determine if an object is empty.
 *
 *  @private
 */
function isEmpty(obj) {
  var key = void 0;
  for (key in obj) {
    return false;
  }
  return true;
}

/**
 *  Compile an HTML string to a list of babel AST programs representing each 
 *  `<template>` element in the input HTML.
 *
 *  The return object contains a `list` array with information about each 
 *  compiled `<template>` element including the compiled function `body` and 
 *  a `render` function as an AST program.
 *
 *  It also contains a `map` object which is an AST program representing a map 
 *  of component identifiers (extracted from the template `id` attribute by 
 *  default) to render functions. 
 *
 *  To generate the string code for the template map:
 *
 *  ```javascript
 *  const trucks = require('trucks')
 *    , babel = require('babel-code')
 *    , tpl = '<template id="x-component"></template>'
 *    , info = trucks.compile(tpl)
 *    , result = babel.transformFromAst(info.map);
 *  console.log(result.code);
 *  ```
 *
 *  @function trucks.compile
 *  @param {String} html an HTML string.
 *  @param {Object} opts processing options.
 *
 *  @option {String=id} [attr] the attribute name used for the component id.
 *  @option {String=skate} [skate] the name of the skatejs variable.
 *  @option {String=vdom} [vdom] the name of the vdom property.
 *  @option {String=element} [element] the name of the element function.
 *  @option {String=text} [text] the name of the text function.
 *  @option {Boolean=true} [normalize] normalize whitespace in templates.
 *  @option {Object|Boolean} [literals] flags for template literal support.
 *  @option {Object} [load] options to use when parsing the DOM.
 *
 *  @throws Error if a template element does not define an identifier.
 *
 *  @returns {Array} of objects representing the function bodies as AST nodes.
 */
function compile(html, opts) {
  var cheerio = require('cheerio');
  opts = opts || {};

  opts.load = opts.load || {};

  if (opts.normalize === undefined) {
    opts.normalize = true;
  } else {
    opts.normalize = Boolean(opts.normalize);
  }

  if (opts.normalize) {
    opts.load.normalizeWhitespace = true;
  }

  if (opts.literals === undefined) {
    opts.literals = {};
    // truthy enable all template literals
  } else if (opts.literals && opts.literals !== Object(opts.literals)) {
    opts.literals = { text: true, attribute: true };
  }

  opts.dom = cheerio.load(html, opts.load);
  opts.attr = opts.attr || ID;

  opts.skate = opts.skate || SKATE;
  opts.vdom = opts.vdom || VDOM;
  opts.element = opts.element || ELEMENT;
  opts.text = opts.text || TEXT;

  opts.name = opts.name || RENDER;
  opts.arg = opts.arg || ELEM;

  var templates = transform(opts.dom, opts);

  return { list: templates, map: map(templates, opts) };
}

/**
 *  Converts the output of a compile pass to an object map of component 
 *  identifiers to render functions.
 *
 *  @private {function} trucks.map
 *  @param {Array} templates list of compiled template programs.
 *  @param {Object} opts processing options.
 *
 *  @returns {Object} AST program mapping components to render functions.
 */
function map(templates, opts) {
  var out = [];

  var t = require('babel-core').types;

  templates.forEach(function (tpl) {
    var expr = t.functionExpression(t.identifier(opts.name), [t.identifier(opts.arg)], t.blockStatement(tpl.body.body));

    // NOTE: must use stringLiteral() rather than identifier() to quote
    // NOTE: the object property which must contain a hyphen for component
    // NOTE: tag names
    out.push(t.objectProperty(t.stringLiteral(tpl.id), expr));
  });
  var program = t.variableDeclaration('const', [t.variableDeclarator(t.identifier('templates'), t.objectExpression(out))]);
  return t.program([program]);
}

/**
 *  Get an object expression from a javascript object.
 *
 *  Designed for the attributes map so only support ObjectProperty 
 *  expressions and assumes all values are string literals.
 *
 *  @private {function} getObjectExpression
 *  @param {Object} t the babel types object.
 *  @param {Object} map the object to convert to an AST expression.
 *  @param {Function} it iterator function to transform property values.
 */
function getObjectExpression(t, map, it) {
  var out = [];
  for (var k in map) {
    out.push(t.objectProperty(t.identifier(k), it(map[k])));
  }
  return t.objectExpression(out);
}

/**
 *  Get a function call expression for defining vdom elements.
 *
 *  Functions are called on the `skate.vdom` member.
 *
 *  @private {function} getCallExpression
 *  @param {Object} t the babel types object.
 *  @param {String} method the name of the function to call (eg: element).
 *  @param {Array} args the argument list for the function call.
 */
function getCallExpression(t, method, args) {
  var expr = t.callExpression(
  // callee
  t.memberExpression(
  // object
  t.memberExpression(
  // object
  t.identifier(SKATE),
  // property
  t.identifier(VDOM)),
  // property
  t.identifier(method)),
  // arguments
  args);
  return expr;
}

/**
 *  Wraps the function body in a function declaration with as single `elem` 
 *  arguments.
 *
 *  @private {function} render
 *  @param {Object} t the babel types object.
 *  @param {Array} body list of function body expressions.
 *  @param {String=render} name the function name.
 *  @param {String=elem} name the function argument.
 *
 *  @returns a function declaration.
 */
function render(t, body, opts) {
  return t.functionDeclaration(t.identifier(opts.name), [t.identifier(opts.arg)], t.blockStatement(body));
}

/**
 *  Convert a single DOM `<template>` element to an AST object.
 *
 *  @private {function} template
 *  @param {Object} el the element DOM.
 *  @param {Object} opts processing options.
 *
 *  @returns {Object} function body AST.
 */
function template(el, opts) {
  var $ = opts.dom,
      babel = require('babel-core'),
      t = babel.types,
      body = [];

  function propertyString(val) {
    return t.stringLiteral(val);
  }

  function propertyTemplate(val) {
    return babel.transform('`' + val + '`').ast.program.body[0].expression;
  }

  function convert(childNodes, body) {
    var i = void 0,
        args = [],
        expr = void 0;

    for (i = 0; i < childNodes.length; i++) {
      var child = childNodes[i];
      var _el = $(child);

      // child tag node (element)
      if (child.type === TAG) {
        args = [t.stringLiteral(child.name)];

        // push attributes into function call when not empty
        var attrs = _el.attr();
        if (!isEmpty(attrs)) {
          var it = propertyString;

          // parse attribute value as template literal
          if (opts.literals.attribute) {
            it = propertyTemplate;
          }

          args.push(getObjectExpression(t, attrs, it));
        }

        // got some child nodes to process
        if (child.childNodes && child.childNodes.length) {

          // get function expression
          var block = [];

          convert(child.childNodes, block);

          // NOTE: no function arguments
          args.push(t.arrowFunctionExpression([], t.blockStatement(block)));
        }

        // call skate.vdom.element();
        expr = t.expressionStatement(getCallExpression(t, ELEMENT, args));
        // child text node
      } else {
        var text = _el.text();
        var arg = void 0;

        // skip text nodes that are just whitespace
        if (opts.normalize && /^\s*$/.test(text)) {
          continue;
        }

        // draft support for template literals in text nodes
        if (opts.literals.text) {
          arg = babel.transform('`' + text + '`').ast.program.body[0].expression;
        } else {
          arg = t.stringLiteral(text);
        }
        // call skate.vdom.text();
        args = [arg];
        expr = t.expressionStatement(getCallExpression(t, TEXT, args));
      }

      body.push(expr);
    }
  }

  convert(el.childNodes, body);

  var tpl = $(el),
      id = tpl.attr(opts.attr);

  if (!id) {
    throw new Error('template declared with no identifier (' + opts.attr + ' attribute)');
  }

  return {
    element: el,
    attributes: tpl.attr(),
    id: id,
    name: tpl.get(0).tagName,
    body: t.program(body),
    render: t.program([render(t, body, opts)])
  };
}

/**
 *  Transform a DOM representation of HTML templates to an array of 
 *  function bodies for each `<template>` element.
 *
 *  @private {function} transform
 *  @param {Object} dom the DOM object.
 *  @param {Object} opts processing options.
 *
 *  @returns {Array} of function bodies.
 */
function transform(dom, opts) {
  var out = [],
      $ = dom,
      templates = $('template');

  templates.each(function (i, el) {
    out.push(template(el, opts));
  });

  return out;
}

compile.map = map;

module.exports = compile;