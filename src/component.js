class ComponentFile extends Object {
  constructor(file, contents, parent) {
    super();

    this.file = file;
    this.contents = contents;
    this.parent = parent;

    // dependencies referenced with `<link rel="import">`
    // propagated during the load compiler phase
    this.imports = [];

    // list of component modules defined with `<dom-module>`
    // propagated during the parse compiler phase
    this.modules = [];
  }
}

module.exports = {
  File: ComponentFile
}

