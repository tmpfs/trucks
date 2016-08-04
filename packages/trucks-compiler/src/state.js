const path = require('path')
    , Logger = require('./logger')
    , CONFIG = 'trucks.js'
    , resolved = {};

/**
 *  Encapsulates the state of the compiler plugin execution.
 *
 *  @public {class} CompilerState
 */
class CompilerState {

  /**
   *  Creates a compiler state.
   *
   *  @public {constructor} CompilerState
   *  @param {Object} options computed options.
   *  @param {Function} compiler reference to the main compiler entry point.
   */
  constructor(options, compiler) {
    const Tree = this.components.Tree;

    // computed processing options
    options = options || {};

    // computed processing options
    this.options = options;

    this.compiler = compiler;

    // the component tree stucture
    this.tree = new Tree();

    this.log = new Logger(options.log);

    this.result = {
      // optional transformed tree result
      tree: undefined
    };

    // output file manifest created during the write phase
    this.manifest = undefined;

    // @private map of output files for write phase
    this._output = {};

    // @private map of protocol schems to resolver classes
    this._registry = null;
  }

  run(options, cb) {
    options = options || {};
    options.plugins = [
      this.compiler.LOAD,
      this.compiler.PARSE,
      this.compiler.TRANSFORM,
      this.compiler.GENERATE
    ];

    // inherit output options
    options.out = this.options.out;
    options.html = this.options.html;
    options.css = this.options.css;
    options.js = this.options.js;

    if(!path.isAbsolute(options.out)) {
      options.out = path.join(process.cwd(), options.out);
    }

    return this.compiler(options, cb); 
  }

  get files() {
    return this.options.files;
  }

  get registry() {
    if(!this._registry) {
      const Registry = require('./registry'); 
      this._registry = new Registry();
    }
    return this._registry;
  }

  getResolver(href, parent) {
    return this.registry.factory(this, href, parent); 
  }

  get output() {
    return this._output;
  }

  getFileKey(name, base) {
    base = this.absolute(base); 
    return this.absolute(name, base);
  }

  hasFile(name, base) {
    const pth = this.getFileKey(name, base);
    return this._output[pth] !== undefined;
  }

  getFile(name, base) {
    const pth = this.getFileKey(name, base);

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
      externalTemplates: 'link[rel="template"][href]',
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

  middleware(options) {
    return (require('./middleware'))(this, options);
  }

  parse(contents, options) {
    const cheerio = require('cheerio');

    options = options || {};
    if(options.lowerCaseAttributeNames === undefined) {
      options.lowerCaseAttributeNames = false; 
    }

    return cheerio.load(contents, options);
  }

  absolute(file, base) {
    if(file && !path.isAbsolute(file)) {
      base = base || process.cwd();
      return path.normalize(path.join(base, file)); 
    }
    return file;
  }

  addConfigFile(file) {
    resolved[this.getConfigFile(file)] = file;
  }

  getConfigFile(file) {
    const base = path.dirname(file)
        , config = path.join(base, CONFIG);
    return config;
  }

  hasConfigFile(file) {
    return resolved[this.getConfigFile(file)];
  }

  loadConfigFile(file) {
    const config = this.getConfigFile(file);
    let conf;

    // NOTE: prevent an infinite loop when the input file
    // NOTE: matches a file in the options `files` array
    if(!resolved[config]) {
      resolved[config] = this.file;
      try {
        conf = require(config);
        conf.base = path.dirname(file);
      // it's ok if there aren't compiler options available
      }catch(e){}
    }

    return conf;
  }
}

/**
 *  Represents an output file that will be written to disc when the 
 *  write plugin is executed.
 *
 *  To get an instance of this class call `state.getFile()`.
 *
 *  @public {class} OutputFile
 */
class OutputFile {

  /**
   *  Creates an output file.
   *
   *  @public {constructor} OutputFile 
   *  @param {String} file path to the file.
   *  @param {String} name relative path for the file.
   *  @param {STring} base base path for the file.
   *  @param {Object} options computed options.
   */
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

  /**
   *  Prepend data to this output file.
   *
   *  @function prepend
   *  @param {String} buf contents to prepend to the file.
   */
  prepend(buf) {
    this._contents.unshift(buf); 
  }

  /**
   *  Append data to this output file.
   *
   *  @function append
   *  @param {String} buf contents to append to the file.
   */
  append(buf) {
    this._contents.push(buf); 
  }

  /**
   *  @property {Array} contents list of file contents.
   */
  set contents(list) {
    this._contents = list; 
  }

  get contents() {
    return this._contents;
  }

  getFileContents() {
    return this._contents.join(this.eol);
  }
}

module.exports = CompilerState;
