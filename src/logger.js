const TRACE = 'trace'
    , DEBUG = 'debug'
    , INFO = 'info'
    , WARN = 'warn'
    , ERROR = 'error'
    , FATAL = 'fatal'
    , LEVELS = [
        TRACE,
        DEBUG,
        INFO,
        WARN,
        ERROR,
        FATAL
      ]
    , BITWISE = {
        none: 0,
        trace: 1,
        debug: 2,
        info: 4,
        warn: 8,
        error: 16,
        fatal: 32,
        all: 63
      }

class Logger {
  constructor(options) {
    options = options || {};
    this._stream = options.stream || process.stderr;
    this._formatter = options.formatter || this.format;
    this._level = options.level || BITWISE.info;

    LEVELS.forEach((lvl) => {
      this[lvl] = (msg, ...params) => {
        this.log(lvl, msg, ...params); 
      } 
    }) 
  }

  enabled(source) {
    if(source === String(source)) {
      source = BITWISE[source];
    }
    return (source&this.level) === source;
  }

  get level() {
    return this._level; 
  }

  set level(val) {
    this._level = val; 
  }

  get stream() {
    return this._stream;
  }

  set stream(val) {
    this._stream = val;
  }

  format(lvl, msg, params) {
    const util = require('util')
        , EOL = require('os').EOL;
    return util.format(msg, ...params) + EOL;
  }

  log(lvl, msg, ...params) {
    if(!this.enabled(lvl)) {
      return false; 
    }
    msg = this._formatter(lvl, msg, params);
    this.stream.write(msg); 
  }
}

module.exports = Logger;
