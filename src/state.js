const path = require('path')

class OutputFile {
  constructor(file, name, base, options) {
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
    this._contents = list; 
  }

  get contents() {
    return this._contents.join(this.eol);
  }
}

class CompilerState {
  constructor(options) {

    // input options
    options = options || {};

    // list of input files
    this.files = options.files || [];

    const Tree = require('./component').Tree;

    // input processing options
    this.options = options;

    // the component tree stucture
    this.tree = new Tree();

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
      scripts: []
    };

    // @private map of output files for write phase
    this._output = {};

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

  get selectors() {
    return {
      modules: 'dom-module',
      imports: 'link[rel="import"][href]',
      styles: '> style, > link[rel="stylesheet"][href]',
      scripts: '> script',
      templates: '> template, > link[rel="template"][href]'
    }
  }

  each(list, it, cb) {
    list = list.slice();
    function next(err) {
      if(err) {
        return cb(err); 
      } 

      const item = list.shift();
      if(!item) {
        return cb(null); 
      }
      it(item, next);
    }
    next();
  }

  get components() {
    return require('./component');
  }

  get readers() {
    return require('./reader');
  }

  middleware(options) {
    return (require('./middleware'))(this, options);
  }

  parse(contents, options) {
    const cheerio = require('cheerio');
    return cheerio.load(contents, options);
  }

  absolute(file, base) {
    if(file && !path.isAbsolute(file)) {
      base = base || process.cwd();
      return path.normalize(path.join(base, file)); 
    }
    return file;
  }
}

module.exports = CompilerState;
