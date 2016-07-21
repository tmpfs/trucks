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

  getTemplates() {
    let out = []; 

    this.imports.forEach((file) => {
      out = out.concat(file.getTemplates()); 
    })

    if(this.modules) {
      this.modules.forEach((mod) => {
        out = out.concat(mod.templates); 
      })
    }

    return out;
  }

  getFiles() {
    let out = []; 

    this.imports.forEach((file) => {
      out.push(file);
      out = out.concat(file.getFiles()); 
    })

    return out;
  }

  getScripts() {
    let out = []; 

    this.imports.forEach((file) => {
      out = out.concat(file.getScripts()); 
    })

    if(this.modules) {
      this.modules.forEach((mod) => {
        out = out.concat(mod.scripts); 
      })
    }

    return out;
  }

  getStyles() {
    let out = []; 

    this.imports.forEach((file) => {
      out = out.concat(file.getStyles()); 
    })

    if(this.modules) {
      this.modules.forEach((mod) => {
        out = out.concat(mod.stylesheets); 
      })
    }

    return out;
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

    // resolver used to load this file
    this.resolver = null;

    // list of component modules defined with `<dom-module>`
    // propagated during the parse compiler phase
    this.modules = [];

    // list of duplicate import paths processed earlier
    // by another component definition
    this.duplicates = [];

    // document DOM (vdom)
    this._document = null;
  }

  set vdom(val) {
    this._document = val; 
  }

  get vdom() {
    return this._document; 
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

    // list of all styles and scripts parsed
    // includes those within dom-module (global) 
    // and those within template elements (component local)
    this.stylesheets = [];
    this.javascript = [];

    // list of global styles parsed as dom-module > style
    this.styles = [];

    // list of global javascript parsed as dom-module > script
    this.scripts = [];
  }

  iterator(it) {
    it({entering: true, node: this});

    if(this.component) {
      it({entering: true, node: this.component});
    }

    this.templates.forEach((node) => {
      node.iterator(it);
    })

    this.stylesheets.forEach((node) => {
      node.iterator(it);
    })

    this.javascript.forEach((node) => {
      node.iterator(it);
    })

    if(this.component) {
      it({entering: false, node: this.component});
    }

    it({entering: false, node: this});
  }

  get vdom() {
    return this.parent.vdom;
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
    this._contents = contents; 
    this.parent = parent;
    this.href = href;
    this._file = file;
    this._id = null;
  }

  attr(name, val) {
    if(name === String(name)) {
      if(val !== undefined) {
        this.element.attribs[name] = val; 
      }else{
        return this.element.attribs[name];
      }
    }else if(name === Object(name)) {
      this.element.attribs = name;
    }
    return this.element.attribs;
  }

  set contents(val) {
    this._contents = val; 
  }

  get contents() {
    return this._contents;
  }

  get vdom() {
    return this.parent.vdom;
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

const DOCUMENT_SCOPE = '::document'
    , SHADOW_SCOPE = '::shadow';

class ScopedTrait extends ComponentTrait {
  constructor() {
    super(...arguments);
    this._scope = DOCUMENT_SCOPE;
  }

  set contents(val) {
    this.vdom(this.element).text(val);
    super.contents = val; 
  }

  get contents() {
    return super.contents;
  }

  set scope(val) {
    this._scope = val;
  }

  get scope() {
    return this._scope;
  }

  isDocumentScope() {
    return (this._scope === DOCUMENT_SCOPE); 
  }

  isShadowScope() {
    return (this._scope === SHADOW_SCOPE); 
  }
}

/**
 *  Represents a style defined by a `<style>` or `<link>` element.
 *
 *  @public {class} ComponentStyle
 *  @inherits ComponentTrait
 */
class ComponentStyle extends ScopedTrait {
  constructor() {
    super(...arguments);
  }
}

// expose scope constants
ComponentStyle.DOCUMENT = DOCUMENT_SCOPE;
ComponentStyle.SHADOW = SHADOW_SCOPE;

/**
 *  Represents a script defined by a `<script>` element.
 *
 *  @public {class} ComponentScript
 *  @inherits ComponentTrait
 */
class ComponentScript extends ScopedTrait {
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

    // list of component local scripts
    // within <template> elements
    this._scripts = [];
  }

  get vdom() {
    return this.parent.vdom;
  }

  get scripts() {
    return this._scripts;
  }

  get id() {
    return this.parent.id;
  }

  get file() {
    return this.parent.file;
  }

  clearStyles() {
    const stylesheets = this.parent.stylesheets;

    // remove styles from parent collection
    this.styles.forEach((style) => {
      const ind = stylesheets.indexOf(style);
      if(~ind) {
        stylesheets.splice(ind, 1); 
      }
    })

    this.styles = [];
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
