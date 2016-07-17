'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RESERVED = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];

/**
 *  Represents an item with imports. 
 *
 *  @public {class} ComponentImport
 */

var ComponentImport = function () {
  function ComponentImport() {
    _classCallCheck(this, ComponentImport);

    // dependencies referenced with `<link rel="import">`
    // propagated during the load compiler phase
    this.imports = [];
  }

  _createClass(ComponentImport, [{
    key: 'iterator',
    value: function iterator(it) {
      this.imports.forEach(function (item) {
        it(item);
        item.iterator(it);
      });
    }
  }]);

  return ComponentImport;
}();

/**
 *  Represents the root of a component hierarchy. 
 *
 *  @public {class} ComponentTree
 */


var ComponentTree = function (_ComponentImport) {
  _inherits(ComponentTree, _ComponentImport);

  function ComponentTree() {
    _classCallCheck(this, ComponentTree);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentTree).call(this));
  }

  return ComponentTree;
}(ComponentImport);

/**
 *  Represents a component file in the component tree. 
 *
 *  @public {class} ComponentFile
 */


var ComponentFile = function (_ComponentImport2) {
  _inherits(ComponentFile, _ComponentImport2);

  function ComponentFile(file, contents, parent) {
    _classCallCheck(this, ComponentFile);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentFile).call(this));

    _this2.file = file;
    _this2.contents = contents;
    _this2.parent = parent;

    //this.imports = [];

    // list of component modules defined with `<dom-module>`
    // propagated during the parse compiler phase
    _this2.modules = [];

    // list of duplicate import paths processed earlier
    // by another component definition
    _this2.duplicates = [];

    // query for the DOM of this document
    // injected during the load phase
    _this2.querySelectorAll = null;
    return _this2;
  }

  _createClass(ComponentFile, [{
    key: 'iterator',
    value: function iterator(it) {
      // iterate our imports
      _get(Object.getPrototypeOf(ComponentFile.prototype), 'iterator', this).call(this, it);

      // iterate modules
      this.modules.forEach(function (mod) {

        // call iterator with module
        it(mod);

        // iterate module items
        mod.iterator(it);
      });
    }
  }]);

  return ComponentFile;
}(ComponentImport);

var ComponentModule = function () {
  function ComponentModule(id, parent) {
    _classCallCheck(this, ComponentModule);

    this.id = id;

    // the owner component file
    this.parent = parent;

    // main component storing
    // the primary template, any partials
    // and component local styles
    this.component = null;

    // list of parsed templates
    this.templates = [];

    // list of all styles parsed
    // includes those within dom-module (global)
    // and those within template elements (component local)
    this.stylesheets = [];

    // list of global styles parsed
    // as dom-module > style
    this.styles = [];

    // list of parsed javascript
    this.scripts = [];

    // injected during the parse phase
    this.querySelectorAll = null;
  }

  _createClass(ComponentModule, [{
    key: 'iterator',
    value: function iterator(it) {

      if (this.component) {
        it(this.component);
      }

      this.templates.forEach(function (item) {
        it(item);
      });
      this.stylesheets.forEach(function (item) {
        it(item);
      });
      this.scripts.forEach(function (item) {
        it(item);
      });
    }
  }, {
    key: 'validate',


    /**
     *  Utility to validate a custom element name.
     *
     *  @private {function} validate
     *
     *  @see https://w3c.github.io/webcomponents/spec/custom/ \ 
     *    #custom-elements-core-concepts
     */
    value: function validate(id) {
      if (~RESERVED.indexOf(id)) {
        throw new Error(id + ' is a reserved custom element name');
      }

      var re = new RegExp('(-|\\.|[0-9]|_|[a-z]|\\uB7' + '|[\\uC0-\\uD6]' + '|[\\uD8-\\uF6]' + '|[\\uF8-\\u37D]' + '|[\\u37F-\\u1FFF]' + '|[\\u200C-\\u200D]' + '|[\\u203F-\\u2040]' + '|[\\u2070-\\u218F]' + '|[\\u2C00-\\u2FEF]' + '|[\\u3001-\\uD7FF]' + '|[\\uF900-\\uFDCF]' + '|[\\uFDF0-\\uFFFFD]' + '|[\\u10000-\\uEFFFF]' + ')*'),
          ptn = new RegExp('^[a-z]' + re.source + '-' + re.source);

      if (!ptn.test(id)) {
        throw new Error('invalid custom element name ' + id);
      }
    }
  }, {
    key: 'file',
    get: function get() {
      return this.parent.file;
    }
  }]);

  return ComponentModule;
}();

var ComponentTrait = function () {
  function ComponentTrait(element, contents, parent, href, file) {
    _classCallCheck(this, ComponentTrait);

    this.element = element;
    this.contents = contents;
    this.parent = parent;
    this.href = href;
    this.file = file;
  }

  _createClass(ComponentTrait, [{
    key: 'inline',
    get: function get() {
      return this.href === undefined;
    }
  }, {
    key: 'type',
    set: function set(val) {
      this.element.attribs.type = val;
    },
    get: function get() {
      return this.element.attribs.type;
    }
  }]);

  return ComponentTrait;
}();

var ComponentTemplate = function (_ComponentTrait) {
  _inherits(ComponentTemplate, _ComponentTrait);

  function ComponentTemplate() {
    _classCallCheck(this, ComponentTemplate);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentTemplate).apply(this, arguments));
  }

  return ComponentTemplate;
}(ComponentTrait);

var ComponentStyle = function (_ComponentTrait2) {
  _inherits(ComponentStyle, _ComponentTrait2);

  function ComponentStyle() {
    _classCallCheck(this, ComponentStyle);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentStyle).apply(this, arguments));
  }

  return ComponentStyle;
}(ComponentTrait);

var ComponentScript = function (_ComponentTrait3) {
  _inherits(ComponentScript, _ComponentTrait3);

  function ComponentScript() {
    _classCallCheck(this, ComponentScript);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentScript).apply(this, arguments));
  }

  return ComponentScript;
}(ComponentTrait);

var Component = function () {
  function Component(template, parent) {
    _classCallCheck(this, Component);

    // primary template for this component
    this.template = template;

    // parent component module
    this.parent = parent;

    // list of other templates to be treated as partials
    // injected during the parse phase
    this.partials = [];

    // list of component local styles that
    // will exist within the shadow DOM
    this.styles = [];
  }

  _createClass(Component, [{
    key: 'scripts',
    get: function get() {
      return this.parent.scripts;
    }
  }, {
    key: 'id',
    get: function get() {
      return this.parent.id;
    }
  }, {
    key: 'file',
    get: function get() {
      return this.parent.file;
    }
  }]);

  return Component;
}();

module.exports = {
  Tree: ComponentTree,
  File: ComponentFile,
  Module: ComponentModule,
  Component: Component,
  Template: ComponentTemplate,
  Style: ComponentStyle,
  Script: ComponentScript
};