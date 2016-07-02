'use strict';

var path = require('path');
var fs = require('fs');

var STYLE = 'style';
var TEMPLATE = 'template';

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
    result.css.push({
      parent: definition.parent,
      file: file,
      contents: $(el).text(),
      inline: true
    });
    cb();

    // external stylesheet reference
  } else {
    (function () {
      var href = path.normalize(path.join(base, $(el).attr('href')));
      fs.readFile(href, function (err, contents) {
        if (err) {
          return cb(err);
        }
        result.css.push({
          parent: definition.parent,
          file: href,
          contents: contents.toString() });
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
    result.js.push({
      parent: definition.parent,
      file: file,
      contents: $(el).text(),
      inline: true
    });
    return cb();

    // external script reference
  } else {
    (function () {
      var href = path.normalize(path.join(base, $(el).attr('src')));
      fs.readFile(href, function (err, contents) {
        if (err) {
          return cb(err);
        }
        result.js.push({
          parent: definition.parent,
          file: href,
          contents: contents.toString() });
        cb();
      });
    })();
  }
}

/**
 *  Compile all inline `<template>` elements an array of HTML strings.
 *
 *  @private
 */
function templates(definition, result, el, cb) {
  var file = definition.file;
  var base = path.dirname(file);
  var $ = definition.dom;

  // inline template element
  if (el.name === TEMPLATE) {
    result.tpl.push({
      parent: definition.parent,
      file: file,
      contents: $.html(el),
      inline: true
    });
    cb();
    // external template reference
  } else {
    (function () {
      var href = path.normalize(path.join(base, $(el).attr('href')));
      fs.readFile(href, function (err, contents) {
        if (err) {
          return cb(err);
        }
        result.tpl.push({
          parent: definition.parent,
          file: href,
          contents: contents.toString() });
        cb();
      });
    })();
  }
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
  var cheerio = require('cheerio');

  function next() {
    var definition = list.shift();
    if (!definition) {
      return cb(null, result);
    }

    definition.parent = collection;

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

        // process inline and external template elements
        elements = $('template, link[rel="template"][href]').toArray();

        iterator(definition, result, elements, templates, function (err) {
          if (err) {
            return cb(err);
          }
          next();
        });
      });
    });
  }

  next();
}

/**
 *  @private
 */
function parse(loaded, opts, cb) {
  // NOTE: not currently any options for the parse
  // NOTE: phase but use consistent function signature
  if (typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts = opts || {};

  var keys = Object.keys(loaded);
  var result = { css: [], js: [], tpl: [], options: opts };

  function next(err) {
    if (err) {
      return cb(err);
    }

    var collection = keys.shift();
    if (!collection) {
      return cb(null, result);
    }
    component(collection, loaded[collection], result, next);
  }

  next();
}

module.exports = parse;