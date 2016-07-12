/**
 *  Represents the root of a component hierarchy. 
 *
 *  @public {class} ComponentTree
 */
class ComponentTree {
  constructor() {
    this.imports = [];
  }
}

/**
 *  Represents a component file in the component tree. 
 *
 *  @public {class} ComponentFile
 */
class ComponentFile {
  constructor(file, contents, parent) {
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
  }
}

class ComponentModule {
  constructor(id, parent) {

    this.id = id;

    // the owner component file
    this.parent = parent; 

    // list of parsed templates
    this.templates = [];

    // list of parsed styles
    this.styles = [];

    // list of parsed javascript
    this.scripts = [];
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

  get id() {
    return this.parent.id;
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

module.exports = {
  Tree: ComponentTree,
  File: ComponentFile,
  Module: ComponentModule,
  Template: ComponentTemplate,
  Style: ComponentStyle,
  Script: ComponentScript
}
