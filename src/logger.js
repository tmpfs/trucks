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
    this._formatter = (options.format instanceof Function)
      ? options.format : this.format;
    this._level = options.level === parseInt(options.level)
        ? options.level
        //: BITWISE.all;
        : (process.env.DEBUG 
          ? BITWISE.all
          : (BITWISE.info | BITWISE.warn | BITWISE.error | BITWISE.fatal));

    LEVELS.forEach((lvl) => {
      this[lvl] = (msg, ...params) => {
        return this.log(lvl, msg, ...params); 
      } 
    }) 
  }

  enabled(source) {
    source = this.getInteger(source);
    return (source&this.level) === source;
  }

  getInteger(source) {
    if(source === String(source)) {
      source = BITWISE[source];
    }
    return source;
  }

  get level() {
    return this._level; 
  }

  set level(source) {
    source = this.getInteger(source);
    this._level = source; 
  }

  get stream() {
    return this._stream;
  }

  set stream(val) {
    this._stream = val;
  }

  getLevelName(lvl) {
    if(lvl === Number(lvl)) {
      for(let k in BITWISE) {
        if(lvl === BITWISE[k]) {
          return k; 
        } 
      }
    }
    return lvl;
  }

  format(lvl, msg, params) {
    const util = require('util')
        , EOL = require('os').EOL;

    let s = '';
    lvl = this.getLevelName(lvl);
    s+= `${lvl.toUpperCase().substr(0, 3)} | `;
    s += util.format(msg, ...params) + EOL;
    return s;
  }

  log(lvl, msg, ...params) {
    // mutate as a level enabled getter, eg: log.info() determines
    // if the INFO level is enabled
    if(lvl !== undefined && msg === undefined) {
      return this.enabled(lvl); 
    }
    if(!this.enabled(lvl)) {
      return false; 
    }
    msg = this._formatter(lvl, msg, params);
    this.stream.write(msg); 
  }
}

module.exports = Logger;
