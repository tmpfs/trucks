'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');

var OutputFile = function () {
  function OutputFile(file, name, base, options) {
    _classCallCheck(this, OutputFile);

    var EOL = require('os').EOL;
    this.eol = options.eol || EOL + EOL;

    // absolute file path
    this.file = file;

    // relative path and file name
    this.name = name;

    // base path for relative path
    this.base = base;

    // list of string contents
    this._contents = [];
  }

  _createClass(OutputFile, [{
    key: 'prepend',
    value: function prepend(buf) {
      this._contents.unshift(buf);
    }
  }, {
    key: 'append',
    value: function append(buf) {
      this._contents.push(buf);
    }
  }, {
    key: 'contents',
    set: function set(list) {
      this._contents = list;
    },
    get: function get() {
      return this._contents.join(this.eol);
    }
  }]);

  return OutputFile;
}();

var CompilerState = function () {
  function CompilerState(options) {
    _classCallCheck(this, CompilerState);

    // private list of middleware to execute
    this.middleware = [];

    // map of output files for write phase
    this._output = {};

    // input options
    options = options || {};

    // list of input files
    this.files = options.files || [];

    var cheerio = require('cheerio'),
        Tree = require('./component').Tree;

    this.parser = {
      module: cheerio,
      parse: cheerio.load
    };

    this.options = options;

    // the component tree stucture
    this.tree = new Tree();

    this.list = [];

    // keep track of processed files during load phase
    this.seen = {
      imports: [],
      sources: []
    };

    this.result = {
      // list of all component files
      files: [],
      // lists of component modules
      modules: [],
      // javascript list of all templates
      templates: [],
      // javascript list of all styles
      styles: [],
      // javascript list of all scripts
      scripts: []
    };
  }

  _createClass(CompilerState, [{
    key: 'hasFile',
    value: function hasFile(name, base) {
      var pth = this.absolute(name, base);
      return this._output[pth] !== undefined;
    }
  }, {
    key: 'getFile',
    value: function getFile(name, base) {
      var pth = this.absolute(name, base);

      // lazy instantiation to return cached version of the file
      // for modification if it already exists
      if (!this._output[pth]) {
        this._output[pth] = new OutputFile(pth, name, base, this.options);
      }

      return this._output[pth];
    }
  }, {
    key: 'absolute',
    value: function absolute(file, base) {
      if (!path.isAbsolute(file)) {
        base = base || process.cwd();
        return path.normalize(path.join(base, file));
      }
      return file;
    }
  }, {
    key: 'output',
    get: function get() {
      return this._output;
    }
  }, {
    key: 'selectors',
    get: function get() {
      return require('./selectors');
    }
  }, {
    key: 'each',
    get: function get() {
      return require('./each');
    }
  }, {
    key: 'components',
    get: function get() {
      return require('./component');
    }
  }, {
    key: 'readers',
    get: function get() {
      return require('./reader');
    }
  }]);

  return CompilerState;
}();

module.exports = CompilerState;