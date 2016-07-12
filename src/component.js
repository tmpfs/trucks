const MIME = {
  template: 'text/html',
  style: 'text/css',
  script: 'text/javascript'
}

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

    // main component
    this.component = null;

    // list of parsed templates
    this.templates = [];

    // list of parsed styles
    this.styles = [];

    // list of parsed javascript
    this.scripts = [];
  }

  get file() {
    return this.parent.file;
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

  /**
   *  Utility to trim a result object contents removing leading and trailing 
   *  newlines.
   *
   *  @private {function} trim
   *  @param {Object} options the trim options.
   */
  trim(options) {
    // only configured to trim inline content
    if(!options || (options.inline && !this.inline)) {
      return; 
    }

    // trim leading and trailing newlines
    if(options.newlines) {
      this.contents = this.contents.replace(/^\n+/, '');
      this.contents = this.contents.replace(/[\n ]+$/, '');
    }

    // trim every line
    if(options.lines && (options.pattern instanceof RegExp)) {
      let lines = this.contents.split('\n');
      lines = lines.map((line) => {
        return line.replace(options.pattern, ''); 
      })
      this.contents = lines.join('\n');
    }
  }
}

class ComponentTemplate extends ComponentTrait {
  constructor() {
    super(...arguments);
  }

  get type() {
    return this.type || MIME.template;
  }
}

class ComponentStyle extends ComponentTrait {
  constructor() {
    super(...arguments);
  }

  get type() {
    return this.type || MIME.style;
  }
}

class ComponentScript extends ComponentTrait {
  constructor() {
    super(...arguments);
  }

  get type() {
    return this.type || MIME.script;
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

  get id() {
    return this.parent.id;
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
