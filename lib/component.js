'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIME = {
  template: 'text/html',
  style: 'text/css',
  script: 'text/javascript'
},
    RESERVED = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];
/**
 *  Represents the root of a component hierarchy. 
 *
 *  @public {class} ComponentTree
 */

var ComponentTree = function ComponentTree() {
  _classCallCheck(this, ComponentTree);

  this.imports = [];
};

/**
 *  Represents a component file in the component tree. 
 *
 *  @public {class} ComponentFile
 */


var ComponentFile = function ComponentFile(file, contents, parent) {
  _classCallCheck(this, ComponentFile);

  this.file = file;
  this.contents = contents;
  this.parent = parent;

  // dependencies referenced with `<link rel="import">`
  // propagated during the load compiler phase
  this.imports = [];

  // list of component modules defined with `<dom-module>`
  // propagated during the parse compiler phase
  this.modules = [];

  // query for the DOM of this document
  // injected during the load phase
  this.querySelectorAll = null;
};

var ComponentModule = function () {
  function ComponentModule(id, parent) {
    _classCallCheck(this, ComponentModule);

    this.id = id;

    // the owner component file
    this.parent = parent;

    // main component
    this.component = null;

    // list of parsed templates
    this.templates = [];

    // list of parsed styles
    this.styles = [];

    // list of parsed javascript
    this.scripts = [];
  }

  _createClass(ComponentModule, [{
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
    key: 'trim',


    /**
     *  Utility to trim a result object contents removing leading and trailing 
     *  newlines.
     *
     *  @private {function} trim
     *  @param {Object} options the trim options.
     */
    value: function trim(options) {
      // only configured to trim inline content
      if (!options || options.inline && !this.inline) {
        return;
      }

      // trim leading and trailing newlines
      if (options.newlines) {
        this.contents = this.contents.replace(/^\n+/, '');
        this.contents = this.contents.replace(/[\n ]+$/, '');
      }

      // trim every line
      if (options.lines && options.pattern instanceof RegExp) {
        var lines = this.contents.split('\n');
        lines = lines.map(function (line) {
          return line.replace(options.pattern, '');
        });
        this.contents = lines.join('\n');
      }
    }
  }, {
    key: 'inline',
    get: function get() {
      return this.href === undefined;
    }
  }, {
    key: 'id',
    get: function get() {
      return this.parent.id;
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

  _createClass(ComponentTemplate, [{
    key: 'type',
    get: function get() {
      return this.type || MIME.template;
    }
  }]);

  return ComponentTemplate;
}(ComponentTrait);

var ComponentStyle = function (_ComponentTrait2) {
  _inherits(ComponentStyle, _ComponentTrait2);

  function ComponentStyle() {
    _classCallCheck(this, ComponentStyle);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentStyle).apply(this, arguments));
  }

  _createClass(ComponentStyle, [{
    key: 'type',
    get: function get() {
      return this.type || MIME.style;
    }
  }]);

  return ComponentStyle;
}(ComponentTrait);

var ComponentScript = function (_ComponentTrait3) {
  _inherits(ComponentScript, _ComponentTrait3);

  function ComponentScript() {
    _classCallCheck(this, ComponentScript);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentScript).apply(this, arguments));
  }

  _createClass(ComponentScript, [{
    key: 'type',
    get: function get() {
      return this.type || MIME.script;
    }
  }]);

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
    key: 'id',
    get: function get() {
      return this.parent.id;
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