const path = require('path')

class OutputFile {
  constructor(file, name, base, options) {
    options = options || {};

    const EOL = require('os').EOL;
    this.eol = options.eol || (EOL + EOL);

    // absolute file path
    this.file = file;

    // relative path and file name
    this.name = name;

    // base path for relative path
    this.base = base;

    // list of string contents
    this._contents = [];
  }

  prepend(buf) {
    this._contents.unshift(buf); 
  }

  append(buf) {
    this._contents.push(buf); 
  }

  set contents(list) {
    // wrap string values
    if(list === String(list)) {
      list = [list]; 
    }
    this._contents = list; 
  }

  get contents() {
    return this._contents.join(this.eol);
  }
}

class CompilerState {
  constructor(options) {

    // private list of middleware to execute
    this.middleware = [];

    // map of output files for write phase
    this._output = {};

    // input options
    options = options || {};

    // list of input files
    this.files = options.files || [];

    const cheerio = require('cheerio')
        , Tree = require('./component').Tree;

    this.parser = {
      module: cheerio,
      parse: cheerio.load
    }

    this.options = options;

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

  get output() {
    return this._output;
  }

  hasFile(name, base) {
    const pth = this.absolute(name, base);
    return this._output[pth] !== undefined;
  }

  getFile(name, base) {
    const pth = this.absolute(name, base);

    // lazy instantiation to return cached version of the file
    // for modification if it already exists
    if(!this._output[pth]) {
      this._output[pth] = new OutputFile(pth, name, base, this.options);
    }

    return this._output[pth]
  }

  absolute(file, base) {
    if(!path.isAbsolute(file)) {
      base = base || process.cwd();
      return path.normalize(path.join(base, file)); 
    }
    return file;
  }

}

module.exports = CompilerState;
