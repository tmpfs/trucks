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
 *  Represents an item with imports. 
 *
 *  @public {class} ComponentImport
 */
class ComponentImport {
  constructor() {
    // dependencies referenced with `<link rel="import">`
    // propagated during the load compiler phase
    this.imports = [];
  }

  iterator(it) {
    this.imports.forEach((item) => {
      it(item);
      item.iterator(it);
    })
  }
}

/**
 *  Represents the root of a component hierarchy. 
 *
 *  @public {class} ComponentTree
 */
class ComponentTree extends ComponentImport {
  constructor() {
    super();
  }
}

/**
 *  Represents a component file in the component tree. 
 *
 *  @public {class} ComponentFile
 */
class ComponentFile extends ComponentImport {
  constructor(file, contents, parent) {
    super();

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
    // iterate our imports
    super.iterator(it); 

    // iterate modules
    this.modules.forEach((mod) => {

      // call iterator with module
      it(mod);

      // iterate module items
      mod.iterator(it); 
    })
  }
}

class ComponentModule {
  constructor(id, parent) {
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

    if(this.component) {
      it(this.component);
    }

    this.templates.forEach((item) => {
      it(item); 
    })
    this.stylesheets.forEach((item) => {
      it(item); 
    })
    this.scripts.forEach((item) => {
      it(item); 
    })
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

class ComponentTrait {
  constructor(element, contents, parent, href, file) {
    this.element = element;
    this.contents = contents; 
    this.parent = parent;
    this.href = href;
    this.file = file;

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
}

class ComponentTemplate extends ComponentTrait {
  constructor() {
    super(...arguments);
  }
}

class ComponentStyle extends ComponentTrait {
  constructor() {
    super(...arguments);
  }
}

class ComponentScript extends ComponentTrait {
  constructor() {
    super(...arguments);
  }
}

class Component {
  constructor(template, parent) {
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
