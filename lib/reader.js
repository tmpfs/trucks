'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs'),
    path = require('path'),
    selectors = require('./selectors'),
    Template = require('./component').Template,
    Style = require('./component').Style,
    Script = require('./component').Script,
    Component = require('./component').Component,
    TEMPLATE = 'template',
    ID = 'id',
    HREF = 'href',
    SRC = 'src';

var TraitReader = function () {
  function TraitReader(module) {
    _classCallCheck(this, TraitReader);

    this.parent = module;

    // type of trait to instantiate
    this.Type = null;

    // selector for the component module
    this.selector = null;

    this.querySelectorAll = module.querySelectorAll;
  }

  _createClass(TraitReader, [{
    key: 'getTrait',
    value: function getTrait(el) {
      return new this.Type(el, null, this.parent);
    }
  }, {
    key: 'getInlineContents',
    value: function getInlineContents(el, $) {
      return $(el).text();
    }
  }, {
    key: 'isInline',
    value: function isInline(el, $) {
      return $(el).attr(HREF) === undefined && $(el).attr(SRC) === undefined;
    }
  }, {
    key: 'getExternalHref',
    value: function getExternalHref(el, $) {
      return $(el).attr(HREF);
    }
  }, {
    key: 'getElements',
    value: function getElements($, context, selector) {
      return $(selector || this.selector, context).toArray();
    }
  }, {
    key: 'readContents',
    value: function readContents(trait, href, cb) {
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
  }, {
    key: 'getContents',
    value: function getContents(trait, el, $, cb) {
      if (this.isInline(el, $)) {
        return cb(null, this.getInlineContents(el, $));
      } else {
        this.readContents(trait, this.getExternalHref(el, $), function (err, contents, result) {
          if (err) {
            return cb(err);
          }

          trait.href = result.href;
          trait.file = result.path;
          cb(null, contents, result);
        });
      }
    }
  }]);

  return TraitReader;
}();

var TemplateReader = function (_TraitReader) {
  _inherits(TemplateReader, _TraitReader);

  function TemplateReader() {
    _classCallCheck(this, TemplateReader);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TemplateReader).apply(this, arguments));

    _this.Type = Template;
    _this.selector = selectors.templates;
    return _this;
  }

  _createClass(TemplateReader, [{
    key: 'getInlineContents',
    value: function getInlineContents(el, $) {
      return $.html(el);
    }
  }, {
    key: 'onTrait',
    value: function onTrait(state, trait, cb) {
      trait.querySelectorAll = state.parser.parse(trait.contents);
      var elements = trait.querySelectorAll(TEMPLATE),
          mod = trait.parent,
          $ = this.querySelectorAll;

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
          mod.component = new Component(trait, mod);

          // prefix module id to template with existing
          // identifier and treat as a partial template
        } else if (id && id !== mod.id) {
          el.attr(ID, prefix + id);
        }

        // assign id to trait
        trait.id = el.attr(ID);
      });

      // update trait contents and query
      // as we have written the dom with id attributes
      trait.contents = $.html(elements);
      trait.querySelectorAll = state.parser.parse(trait.contents);

      trait.trim(state.options.trim);

      trait.parent.templates.push(trait);
      state.result.templates.push(trait);
      cb(null, trait);
    }
  }]);

  return TemplateReader;
}(TraitReader);

var StyleReader = function (_TraitReader2) {
  _inherits(StyleReader, _TraitReader2);

  function StyleReader() {
    _classCallCheck(this, StyleReader);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(StyleReader).apply(this, arguments));

    _this2.Type = Style;
    _this2.selector = selectors.styles;
    return _this2;
  }

  _createClass(StyleReader, [{
    key: 'onTrait',
    value: function onTrait(state, trait, cb) {
      trait.querySelectorAll = state.parser.parse(trait.contents);
      trait.trim(state.options.trim);
      trait.parent.styles.push(trait);
      state.result.styles.push(trait);
      cb(null, this);
    }
  }]);

  return StyleReader;
}(TraitReader);

var ScriptReader = function (_TraitReader3) {
  _inherits(ScriptReader, _TraitReader3);

  function ScriptReader() {
    _classCallCheck(this, ScriptReader);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(ScriptReader).apply(this, arguments));

    _this3.Type = Script;
    _this3.selector = selectors.scripts;
    return _this3;
  }

  _createClass(ScriptReader, [{
    key: 'getExternalHref',
    value: function getExternalHref(el, $) {
      return $(el).attr(SRC);
    }
  }, {
    key: 'onTrait',
    value: function onTrait(state, trait, cb) {
      trait.querySelectorAll = state.parser.parse(trait.contents);
      trait.trim(state.options.trim);
      trait.parent.scripts.push(trait);
      state.result.scripts.push(trait);
      cb(null, trait);
    }
  }]);

  return ScriptReader;
}(TraitReader);

module.exports = {
  Template: TemplateReader,
  Style: StyleReader,
  Script: ScriptReader
};