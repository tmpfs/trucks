"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var ComponentModule = function ComponentModule(id, parent) {
  _classCallCheck(this, ComponentModule);

  this.id = id;

  // the owner component file
  this.parent = parent;

  // list of parsed templates
  this.tpl = [];

  // list of parsed styles
  this.css = [];

  // list of parsed javascript
  this.js = [];
};

module.exports = {
  Tree: ComponentTree,
  File: ComponentFile,
  Module: ComponentModule
};