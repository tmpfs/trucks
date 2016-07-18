const RESERVED = [
    'annotation-xml',
    'color-profile',
    'font-face',
    'font-face-src',
    'font-face-uri',
    'font-face-format',
    'font-face-name',
    'missing-glyph'
  ];

/**
 *  Abstract class for all nodes of a component tree.
 *
 *  @private {class} ComponentNode
 */
class ComponentNode {}

/**
 *  Represents a node with imports.
 *
 *  @private {class} ComponentImport
 *  @inherits ComponentNode
 */
class ComponentImport extends ComponentNode {
  constructor() {
    super(...arguments);
    // dependencies referenced with `<link rel="import">`
    // propagated during the load compiler phase
    this.imports = [];
  }

  iterator(it) {
    it({entering: true, node: this});
    this.imports.forEach((node) => {
      node.iterator(it);
    })
    it({entering: false, node: this});
  }
}

/**
 *  Represents the root of a component hierarchy. 
 *
 *  @public {class} ComponentTree
 *  @inherits ComponentImport
 */
class ComponentTree extends ComponentImport {
  constructor() {
    super(...arguments);
  }
}

/**
 *  Represents a file in the component tree. 
 *
 *  @public {class} ComponentFile
 *  @inherits ComponentImport
 */
class ComponentFile extends ComponentImport {

  /**
   *  Creates a component file node.
   *
   *  @public {constructor} ComponentFile
   *  @param {String} file path to the file.
   *  @param {String} contents file contents.
   *  @param {Object} parent file owner.
   */
  constructor(file, contents, parent) {
    super(...arguments);

    this.file = file;
    this.contents = contents;
    this.parent = parent;

    //this.imports = [];

    // list of component modules defined with `<dom-module>`
    // propagated during the parse compiler phase
    this.modules = [];

    // list of duplicate import paths processed earlier
    // by another component definition
    this.duplicates = [];

    // query for the DOM of this document
    // injected during the load phase
    this.querySelectorAll = null;
  }

  iterator(it) {
    it({entering: true, node: this});

    // iterate our imports
    this.imports.forEach((node) => {
      node.iterator(it);
    })

    // iterate modules
    this.modules.forEach((node) => {
      node.iterator(it); 
    })

    it({entering: false, node: this});
  }
}

/**
 *  Represents a module defined by a `<dom-module>` element.
 *
 *  @public {class} ComponentModule
 *  @inherits ComponentNode
 */
class ComponentModule extends ComponentNode {

  /**
   *  Creates a component module node.
   *
   *  @public {constructor} ComponentModule
   *  @param {String} id module identifier.
   *  @param {Object} parent module owner.
   */
  constructor(id, parent) {
    super(...arguments);
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

  iterator(it) {

    it({entering: true, node: this});

    if(this.component) {
      this.component.iterator(it);
    }

    this.templates.forEach((node) => {
      node.iterator(it);
    })

    this.stylesheets.forEach((node) => {
      node.iterator(it);
    })

    this.scripts.forEach((node) => {
      node.iterator(it);
    })

    it({entering: false, node: this});
  }

  get file() {
    return this.parent.file;
  }

  /**
   *  Utility to validate a custom element name.
   *
   *  @private {function} validate
   *
   *  @see https://w3c.github.io/webcomponents/spec/custom/ \ 
   *    #custom-elements-core-concepts
   */
  validate(id) {
    if(~RESERVED.indexOf(id)) {
      throw new Error(`${id} is a reserved custom element name`); 
    }

    const re = new RegExp('(-|\\.|[0-9]|_|[a-z]|\\uB7'
        + '|[\\uC0-\\uD6]'
        + '|[\\uD8-\\uF6]'
        + '|[\\uF8-\\u37D]'
        + '|[\\u37F-\\u1FFF]'
        + '|[\\u200C-\\u200D]'
        + '|[\\u203F-\\u2040]'
        + '|[\\u2070-\\u218F]'
        + '|[\\u2C00-\\u2FEF]'
        + '|[\\u3001-\\uD7FF]'
        + '|[\\uF900-\\uFDCF]'
        + '|[\\uFDF0-\\uFFFFD]'
        + '|[\\u10000-\\uEFFFF]'
        + ')*')
      , ptn = new RegExp(
        '^[a-z]'
        + re.source
        + '-'
        + re.source
      );

    if(!ptn.test(id)) {
      throw new Error(`invalid custom element name ${id}`); 
    }
  }
}

class ComponentTrait extends ComponentNode {
  constructor(element, contents, parent, href, file) {
    super(...arguments);
    this.element = element;
    this.contents = contents; 
    this.parent = parent;
    this.href = href;
    this._file = file;
    this._id = null;
  }

  set id(val) {
    this._id = val; 
  }

  get id() {
    return this._id;
  }

  set file(val) {
    this._file = val;
  }

  get file() {
    return this._file || this.parent.file;
  }

  get inline() {
    return this.href === undefined;
  }

  set type(val) {
    this.element.attribs.type = val;
  }

  get type() {
    return this.element.attribs.type; 
  }

  iterator(it) {
    it({entering: true, node: this});
    // component traits are considered leaf nodes at the moment
    it({entering: false, node: this});
  }
}

/**
 *  Represents a template defined by a `<template>` or `<link>` element.
 *
 *  @public {class} ComponentTemplate
 *  @inherits ComponentTrait
 */
class ComponentTemplate extends ComponentTrait {
  constructor() {
    super(...arguments);
  }

  set id(val) {
    super.id = val; 
  }

  get id() {
    return super.id || this.parent.id;
  }
}

/**
 *  Represents a style defined by a `<style>` or `<link>` element.
 *
 *  @public {class} ComponentStyle
 *  @inherits ComponentTrait
 */
class ComponentStyle extends ComponentTrait {
  constructor() {
    super(...arguments);
  }
}

/**
 *  Represents a script defined by a `<script>` element.
 *
 *  @public {class} ComponentScript
 *  @inherits ComponentTrait
 */
class ComponentScript extends ComponentTrait {
  constructor() {
    super(...arguments);
  }
}

/**
 *  Represents a component node with a main template, list of 
 *  template partials and component local styles.
 *
 *  @public {class} Component
 *  @inherits ComponentNode
 */
class Component extends ComponentNode {

  /**
   *  Creates a component node.
   *
   *  @public {constructor} Component
   *  @param {Object} template primary template for the component.
   *  @param {Object} parent component owner (module).
   */
  constructor(template, parent) {
    super(...arguments);

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

  get scripts() {
    return this.parent.scripts;
  }

  get id() {
    return this.parent.id;
  }

  get file() {
    return this.parent.file;
  }

  iterator(it) {
    it({entering: true, node: this});

    // all our children are duplicates of the module generic lists
    // so emitting them here is not a good idea

    it({entering: false, node: this});
  }
}

module.exports = {
  Tree: ComponentTree,
  File: ComponentFile,
  Module: ComponentModule,
  Component: Component,
  Template: ComponentTemplate,
  Style: ComponentStyle,
  Script: ComponentScript
}
