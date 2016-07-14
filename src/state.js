function CompilerState(options) {
  // private list of middleware to execute
  this.middleware = [];

  // input options
  this.options = options || {};
  // list of input files
  this.files = options.files || [];

  const cheerio = require('cheerio')
      , Tree = require('./component').Tree;

  this.parser = {
    module: cheerio,
    parse: cheerio.load
  }

  // the component tree stucture
  this.tree = new Tree();

  this.list = [];

  // keep track of processed files during load phase
  this.seen  = {
    imports: [],
    sources: []
  }

  this.result = {
    // list of all component files
    files: [] ,
    // lists of component modules
    modules: [],
    // javascript list of all templates
    templates: [],
    // javascript list of all styles
    styles: [],
    // javascript list of all scripts
    scripts: [],

    // compiler output AST structures
    compiler: {}
  };
}

module.exports = CompilerState;
