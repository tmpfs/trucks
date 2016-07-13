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

function readContents(trait, href, cb) {
  var file = trait.parent.parent.file,
      base = path.dirname(file),
      pth = path.normalize(path.join(base, href));

  fs.readFile(pth, function (err, contents) {
    if (err) {
      return cb(err);
    }
    cb(null, contents.toString(), { file: file, base: base, path: pth, href: href });
  });
}

/**
 *  Iterate the templates, scripts and styles in a component module.
 *
 *  @private
 */
function component(mod, state, context, cb) {
  var options = state.options;

  var $ = mod.querySelectorAll,
      types = [{
    elements: $(selectors.templates, context).toArray(),
    getTrait: function getTrait(el, mod, contents, href, file) {
      return new Template(el, contents, mod, href, file);
    },
    isInline: function isInline(el) {
      return el.name === TEMPLATE;
    },
    getInlineContents: function getInlineContents(el, $) {
      return $.html(el);
    },
    getExternalHref: function getExternalHref(el, $) {
      return $(el).attr('href');
    },
    onTrait: function onTrait(item, cb) {
      item.querySelectorAll = state.parser.parse(item.contents);
      var elements = item.querySelectorAll(TEMPLATE);

      elements.each(function (index, elem) {
        var el = $(elem);

        var prefix = /-$/.test(mod.id) ? mod.id : mod.id + '-',
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
          el.attr(ID, prefix + id);
        }

        // assign id to trait
        item.id = el.attr(ID);
      });

      // update trait contents and query
      // as we have written the dom with id attributes
      item.contents = $.html(elements);
      item.querySelectorAll = state.parser.parse(item.contents);

      item.trim(state.options.trim);

      mod.templates.push(item);
      state.result.templates.push(item);
      cb(null, item);
    }
  }, {
    elements: $(selectors.styles, context).toArray(),
    getTrait: function getTrait(el, mod, contents, href, file) {
      return new Style(el, contents, mod, href, file);
    },
    isInline: function isInline(el) {
      return el.name === STYLE;
    },
    getInlineContents: function getInlineContents(el, $) {
      return $(el).text();
    },
    getExternalHref: function getExternalHref(el, $) {
      return $(el).attr('href');
    },
    onTrait: function onTrait(item, cb) {
      item.querySelectorAll = state.parser.parse(item.contents);
      item.trim(state.options.trim);
      mod.styles.push(item);
      state.result.styles.push(item);
      cb(null, item);
    }
  }, {
    elements: $(selectors.scripts, context).toArray(),
    getTrait: function getTrait(el, mod, contents, href, file) {
      return new Script(el, contents, mod, href, file);
    },
    isInline: function isInline(el, $) {
      var src = $(el).attr('src');
      return src === undefined;
    },
    getInlineContents: function getInlineContents(el, $) {
      return $(el).text();
    },
    getExternalHref: function getExternalHref(el, $) {
      return $(el).attr('src');
    },
    onTrait: function onTrait(item, cb) {
      item.querySelectorAll = state.parser.parse(item.contents);
      item.trim(state.options.trim);
      mod.scripts.push(item);
      state.result.scripts.push(item);
      cb(null, item);
    }
  }];

  function iterator(type, cb) {
    var elements = type.elements,
        $ = mod.querySelectorAll;

    each(elements, function (el, next) {

      function getContents(trait, cb) {
        if (type.isInline(el, $)) {
          return cb(null, type.getInlineContents(el, $));
        } else {
          readContents(trait, type.getExternalHref(el, $), function (err, contents, result) {
            if (err) {
              return cb(err);
            }

            trait.href = result.href;
            trait.file = result.path;
            cb(null, contents, result);
          });
        }
      }

      var trait = type.getTrait(el, mod);

      getContents(trait, function (err, contents) {
        if (err) {
          return next(err);
        }

        trait.contents = contents;

        type.onTrait(trait, function (err) {
          if (err) {
            return next(err);
          }

          // perform {{id}} replacement
          if (trait && trait.contents === String(trait.contents) && options.id && options.id.replace && options.id.pattern instanceof RegExp) {

            trait.contents = trait.contents.replace(options.id.pattern, mod.id);
          }

          next(null, trait);
        });
      });
    }, cb);
  }

  each(types, iterator, function (err) {
    if (err) {
      return cb(err);
    }

    // found primary component template
    if (mod.component) {

      // got some partials to assign
      if (mod.templates.length > 1) {
        for (var i = 0; i < mod.templates.length; i++) {
          if (mod.component.template !== mod.templates[i]) {
            mod.component.partials.push(mod.templates[i]);
          }
        }
        console.log('got module with partials...');
      }
    }

    cb();
  });
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

    // no component imports and no modules declared
    //if(!elements.length
    //&& !group.imports.length
    //&& !group.duplicates.length) {
    //return cb(new Error(
    //`no imports or component modules in ${group.file}`));
    //}

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