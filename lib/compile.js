'use strict';

var SKATE = 'skate',
    VDOM = 'vdom',
    ELEMENT = 'element';
//, text = 'text';

/**
 *  Utility to determine if an object is empty.
 *
 *  @private
 */
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

/**
 *  Compile an HTML string to a babel AST path.
 *
 *  @function compile
 *  @param {String} html an HTML string.
 *  @param {Object} opts processing options.
 *
 *  @return {Array} of function bodies.
 */
function compile(html, opts) {
  var cheerio = require('cheerio');
  opts = opts || {};

  opts.dom = cheerio.load(html);
  opts.attr = opts.attr || 'id';

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
 */
function getObjectExpression(t, map) {
  var out = [];
  for (var k in map) {
    out.push(t.objectProperty(t.identifier(k), t.stringLiteral(map[k])));
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
 *  Convert a single DOM `<template>` element to an AST object.
 *
 *  @function template
 *  @param {Object} el the element DOM.
 *  @param {Object} opts processing options.
 *
 *  @return {Object} function body AST.
 */
function template(el, opts) {
  var $ = opts.dom,
      t = require('babel-core').types,
      body = [];

  function convert(nodes) {
    nodes.each(function (i, child) {
      var args = [t.stringLiteral(child.tagName)];

      // push attributes into function call when not empty
      var attrs = $(child).attr();
      if (!isEmpty(attrs)) {
        args.push(getObjectExpression(t, attrs));
      }

      var expr = t.expressionStatement(getCallExpression(t, ELEMENT, args));

      body.push(expr);
    });
  }

  convert($(el.children()));

  return {
    element: el,
    attributes: el.attr(),
    id: el.attr(opts.attr),
    name: el.get(0).tagName,
    body: t.program(body)
  };
}

/**
 *  Transform a DOM representation of HTML templates to an array of 
 *  function bodies for each `<template>` element.
 *
 *  @function transform
 *  @param {Object} dom the DOM object.
 *  @param {Object} opts processing options.
 *
 *  @return {Array} of function bodies.
 */
function transform(dom, opts) {
  var out = [],
      $ = dom,
      templates = $('template');

  templates.each(function (i, el) {
    out.push(template($(el), opts));
  });

  return out;
}

compile.transform = transform;
compile.template = template;

module.exports = compile;