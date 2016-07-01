const TAG = 'tag'
    , SKATE = 'skate'
    , VDOM = 'vdom'
    , ELEMENT = 'element'
    , TEXT = 'text';
  
/**
 *  Utility to determine if an object is empty.
 *
 *  @private
 */
function isEmpty(obj) {
  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

/**
 *  Compile an HTML string to a babel AST program.
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
 *  @option {Object|Boolean} [literals] flags for template literal support.
 *  @option {Object} [load] options to use when parsing the DOM.
 *
 *  @returns {Array} of objects representing the function bodies as AST nodes.
 */
function compile(html, opts) {
  const cheerio = require('cheerio');
  opts = opts || {};

  opts.load = opts.load || {};

  if(opts.load.normalizeWhitespace === undefined) {
    opts.load.normalizeWhitespace = true; 
  }

  if(opts.literals === undefined) {
    opts.literals = {}; 
  // truthy enable all template literals
  }else if(opts.literals && typeof opts.literals !== 'object') {
    opts.literals = {text: true, attribute: true}; 
  }

  opts.dom = cheerio.load(html, opts.load);
  opts.attr = opts.attr || 'id';

  opts.skate = opts.skate || SKATE;
  opts.vdom = opts.vdom || VDOM;
  opts.element = opts.element || ELEMENT;
  opts.text = opts.text || TEXT;

  return transform(opts.dom, opts);
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
  const out = [];
  for(let k in map) {
    out.push(
      t.objectProperty(t.identifier(k), it(map[k]))
    );
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
  const expr =
    t.callExpression(
      // callee
      t.memberExpression(
        // object
        t.memberExpression(
          // object
          t.identifier(SKATE),
          // property
          t.identifier(VDOM)
        ),
        // property
        t.identifier(method)
      ),
      // arguments
      args
    );
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
function render(t, body, name, arg) {
  name = name || 'render';
  arg = arg || 'elem';
  return t.functionDeclaration(
    t.identifier(name), [t.identifier(arg)], t.blockStatement(body));
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
  const $ = opts.dom
    , babel = require('babel-core')
    , t = babel.types
    , body = [];


  function propertyString(val) {
    return t.stringLiteral(val);
  }

  function propertyTemplate(val) {
    return babel.transform(
      '`' + val  + '`').ast.program.body[0].expression;
  }

  function convert(childNodes, body) {
    let i
      , args = []
      , expr;

    for(i = 0;i < childNodes.length;i++) {
      const child = childNodes[i];
      const el = $(child);

      // child tag node (element)
      if(child.type === TAG) {
        args = [t.stringLiteral(child.name)];

        // push attributes into function call when not empty
        const attrs = el.attr();
        if(!isEmpty(attrs)) {
          let it = propertyString;

          // parse attribute value as template literal
          if(opts.literals.attribute) {
            it = propertyTemplate;
          }

          args.push(getObjectExpression(t, attrs, it));
        }

        // got some child nodes to process
        if(child.childNodes && child.childNodes.length) {
       
          // get function expression
          const block = [];

          convert(child.childNodes, block);

          // NOTE: no function arguments
          args.push(
            t.arrowFunctionExpression([], t.blockStatement(block))
          );
        }

        // call skate.vdom.element();
        expr = t.expressionStatement(
          getCallExpression(t, ELEMENT, args));
      // child text node
      }else{
        const text = el.text();
        let arg;

        // skip text nodes that are just whitespace
        if(opts.load.normalizeWhitespace && /^\s*$/.test(text)) {
          continue; 
        }

        // draft support for template literals in text nodes
        if(opts.literals.text) {
          arg = babel.transform(
            '`' + text + '`').ast.program.body[0].expression;
        }else{
          arg = t.stringLiteral(text);
        }
        // call skate.vdom.text();
        args = [arg];
        expr = t.expressionStatement(
          getCallExpression(t, TEXT, args));
      }

      body.push(expr);
    }
  }

  convert(el.childNodes, body);

  const tpl = $(el);
  return {
    element: el,
    attributes: tpl.attr(),
    id: tpl.attr(opts.attr),
    name: tpl.get(0).tagName,
    body: t.program(body),
    render: t.program([render(t, body)])
  }
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
  const out = []
    , $ = dom
    , templates = $('template');

  templates.each((i, el) => {
    out.push(template(el, opts));
  })

  return out;
}

compile.transform = transform;
compile.template = template;

module.exports = compile;
