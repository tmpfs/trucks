'use strict';

var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');

var STYLE = 'style';
var LINK = 'link';

var SKATE = 'skate';
var DEFINE = 'define';

/**
 *  Compile all inline and external stylesheets to an array of CSS strings.
 *
 *  @private
 */
function styles(definition, result, el, cb) {
  var file = definition.file;
  var base = path.dirname(file);
  var $ = definition.dom;

  // inline style element
  if (el.name === STYLE) {
    result.css.push({ file: file, contents: $(el).text().trim(), inline: true });
    return cb();

    // external stylesheet reference
  } else if (el.name === LINK) {
    (function () {
      var href = path.normalize(path.join(base, $(el).attr('href')));
      fs.readFile(href, function (err, contents) {
        if (err) {
          return cb(err);
        }
        result.css.push({ file: href, contents: contents.toString() });
        cb();
      });
    })();
  }
}

/**
 *  Compile all inline and external scripts to an array of Javascript strings.
 *
 *  @private
 */
function scripts(definition, result, el, cb) {
  var file = definition.file;
  var base = path.dirname(file);
  var $ = definition.dom;
  var src = $(el).attr('src');

  // inline script element
  if (!src) {
    result.js.push({ file: file, contents: $(el).text().trim(), inline: true });
    return cb();

    // external script reference
  } else {
    (function () {
      var href = path.normalize(path.join(base, $(el).attr('src')));
      fs.readFile(href, function (err, contents) {
        if (err) {
          return cb(err);
        }
        result.js.push({ file: href, contents: contents.toString() });
        cb();
      });
    })();
  }
}

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

/**
 *  Iterate the elements returned by a DOM query.
 *
 *  @private
 */
function iterator(definition, result, elements, it, cb) {

  function next(err) {
    if (err) {
      return cb(err);
    }

    var el = elements.shift();
    if (!el) {
      return cb();
    }

    it(definition, result, el, next);
  }

  next();
}

/**
 *  Iterate the components for a collection of components.
 *
 *  @private
 */
function component(collection, list, result, cb) {
  function next(err) {
    if (err) {
      return cb(err);
    }
    var definition = list.shift();
    if (!definition) {
      return cb();
    }

    var $ = definition.dom = cheerio.load(definition.contents);

    // process styles first and maintain declaration order
    var elements = $('style, link[rel="stylesheet"][href]').toArray();

    iterator(definition, result, elements, styles, function (err) {
      if (err) {
        return cb(err);
      }

      // process inline and external scripts
      elements = $('script').toArray();
      iterator(definition, result, elements, scripts, function (err) {
        if (err) {
          return cb(err);
        }

        // find component javascript definitions
        defs(result, next);
      });
    });
  }

  next();
}

/**
 *  Parses the loaded file data to stylesheet and javascript strings.
 *
 *  @function parser
 *  @param {Object} contents The loaded file data.
 *  @param {Function} cb callback function.
 */
function parser(contents, cb) {
  var keys = Object.keys(contents);
  var result = { css: [], js: [] };

  function next(err) {
    if (err) {
      return cb(err);
    }

    var collection = keys.shift();
    if (!collection) {
      return cb(null, result);
    }
    component(collection, contents[collection], result, next);
  }

  next();
}

module.exports = parser;