'use strict';

var path = require('path'),
    fs = require('fs'),
    each = require('./each'),
    selectors = require('./selectors'),
    Module = require('./component').Module,
    Template = require('./component').Template,
    Style = require('./component').Style,
    Script = require('./component').Script,
    Component = require('./component').Component,
    STYLE = 'style',
    TEMPLATE = 'template',
    ID = 'id';

/**
 *  Compile all inline `<template>` elements an array of HTML strings.
 *
 *  @private
 */
function templates(mod, state, el, cb) {
  var file = mod.parent.file,
      base = path.dirname(file),
      $ = mod.querySelectorAll;

  var trait = void 0;

  function done(item) {

    item.querySelectorAll = state.parser.parse(item.contents);

    var templates = item.querySelectorAll(TEMPLATE),
        prefix = /-$/.test(mod.id) ? mod.id : mod.id + '-';

    templates.each(function (index, elem) {
      var el = $(elem),
          id = el.attr(ID);

      // inherit template from module
      if (!id || id === mod.id) {

        if (mod.component) {
          return cb(new Error('duplicate main template for ' + mod.id + ' in ' + mod.file));
        }

        // set id attribute in case it were undefined
        // thereby inherit from the module id
        el.attr(ID, mod.id);

        // assign as primary component template
        mod.component = new Component(item, mod);

        // prefix module id to template with existing
        // identifier and treat as a partial template
      } else if (id && id !== mod.id) {
        el.attr(ID, '' + (prefix + id));
      }
    });

    // update trait contents and query
    // as we have written the dom with id attributes
    item.contents = $.html(templates);
    item.querySelectorAll = state.parser.parse(item.contents);

    item.trim(state.options.trim);

    mod.templates.push(item);
    state.result.templates.push(item);
    cb(null, item);
  }

  // inline template element
  if (el.name === TEMPLATE) {
    trait = new Template(el, $.html(el), mod);
    done(trait);
    // external template reference
  } else {
    (function () {
      var href = $(el).attr('href'),
          pth = path.normalize(path.join(base, href));
      fs.readFile(pth, function (err, contents) {
        if (err) {
          return cb(err);
        }

        trait = new Template(el, contents.toString(), mod, href, file);
        done(trait);
      });
    })();
  }
}

/**
 *  Compile all inline and external stylesheets to an array of CSS strings.
 *
 *  @private
 */
function styles(mod, state, el, cb) {
  var file = mod.parent.file,
      base = path.dirname(file),
      $ = mod.querySelectorAll;

  var trait = void 0;

  function done(item) {
    item.querySelectorAll = state.parser.parse(item.contents);

    item.trim(state.options.trim);

    mod.styles.push(item);
    state.result.styles.push(item);
    cb(null, item);
  }

  // inline style element
  if (el.name === STYLE) {
    trait = new Style(el, $(el).text(), mod);
    done(trait);
    // external stylesheet reference
  } else {
    (function () {
      var href = $(el).attr('href'),
          pth = path.normalize(path.join(base, href));

      fs.readFile(pth, function (err, contents) {
        if (err) {
          return cb(err);
        }

        trait = new Style(el, contents.toString(), mod, href, file);
        done(trait);
      });
    })();
  }
}

/**
 *  Compile all inline and external scripts to an array of Javascript strings.
 *
 *  @private
 */
function scripts(mod, state, el, cb) {
  var file = mod.parent.file,
      base = path.dirname(file),
      $ = mod.querySelectorAll,
      src = $(el).attr('src');

  var trait = void 0;

  function done(item) {
    item.querySelectorAll = state.parser.parse(item.contents);

    item.trim(state.options.trim);

    mod.scripts.push(item);
    state.result.scripts.push(item);
    cb(null, item);
  }

  // inline script element
  if (!src) {
    trait = new Script(el, $(el).text(), mod);
    done(trait);
    // external script reference
  } else {
    (function () {
      var href = $(el).attr('src'),
          pth = path.normalize(path.join(base, href));
      fs.readFile(pth, function (err, contents) {
        if (err) {
          return cb(err);
        }
        trait = new Script(el, contents.toString(), mod, href, file);
        done(trait);
      });
    })();
  }
}

/**
 *  Iterate the templates, scripts and styles in a component module.
 *
 *  @private
 */
function component(mod, state, context, cb) {
  var options = state.options;

  function iterator(elements, it, cb) {
    each(elements, function (el, next) {
      it(mod, state, el, function (err, item) {
        if (err) {
          return next(err);
        }

        // perform {{id}} replacement
        if (item && item.contents === String(item.contents) && options.id && options.id.replace && options.id.pattern instanceof RegExp) {

          item.contents = item.contents.replace(options.id.pattern, mod.id);
        }

        next();
      });
    }, cb);
  }

  var $ = mod.querySelectorAll,
      groups = [{
    handler: styles,
    elements: $(selectors.styles, context).toArray()
  }, {
    handler: scripts,
    elements: $(selectors.scripts, context).toArray()
  }, {
    handler: templates,
    elements: $(selectors.templates, context).toArray()
  }];

  each(groups, function (group, next) {
    iterator(group.elements, group.handler, next);

    // TODO: parse component partials and styles
  }, cb);
}

/**
 *  Iterate `<dom-module>` elements.
 *
 *  @private {function} modules
 */
function modules(state, cb) {
  each(state.result.files, function (group, next) {
    // parse all the <dom-module> elements
    var $ = group.querySelectorAll,
        elements = $(selectors.modules).toArray();
    each(elements, function (context, next) {
      var id = $(context).attr(ID);

      if (!id) {
        return next(new Error('identifier missing for component module in ' + group.file));
      }

      var mod = new Module(id, group);

      // validate custom element name as per the spec
      try {
        mod.validate(id);
      } catch (e) {
        return next(e);
      }

      // proxy document query function
      mod.querySelectorAll = $;

      // add to local list of modules
      group.modules.push(mod);

      // add to global list of all modules
      state.result.modules.push(mod);

      component(mod, state, context, next);
    }, next);
  }, function (err) {
    cb(err, state);
  });
}

module.exports = modules;