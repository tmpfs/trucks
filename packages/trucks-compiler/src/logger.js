const NONE = 'none'
    , TRACE = 'trace'
    , DEBUG = 'debug'
    , INFO = 'info'
    , WARN = 'warn'
    , ERROR = 'error'
    , FATAL = 'fatal'
    , ALL = 'all'
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
    , KEYS = [
        {key: NONE,  value: BITWISE.none},
        {key: TRACE,  value: BITWISE.trace},
        {key: DEBUG,  value: BITWISE.debug},
        {key: INFO,  value: BITWISE.info},
        {key: WARN,  value: BITWISE.warn},
        {key: ERROR,  value: BITWISE.error},
        {key: FATAL,  value: BITWISE.fatal},
        {key: ALL,  value: BITWISE.all},
      ]

class Logger {
  constructor(options) {
    options = options || {};
    this._stream = options.stream || process.stderr;
    this._formatter = (options.format instanceof Function)
      ? options.format : this.format;

    /* istanbul ignore next: don't want to enable DEBUG in tests */
    this._level = options.level === parseInt(options.level)
        ? options.level
        //: BITWISE.all;
        : (process.env.DEBUG 
          ? BITWISE.all
          : (BITWISE.info | BITWISE.warn | BITWISE.error | BITWISE.fatal));

    if(!process.env.DEBUG
      && process.env.NODE_ENV === 'test'
      && !process.env.TEST_LOGGER) {
      this._level = BITWISE.none; 
    }

    LEVELS.forEach((lvl) => {
      this[lvl] = (msg, ...params) => {
        return this.log(lvl, msg, ...params); 
      } 
    }) 

    // bitwise level constants
    for(let key in BITWISE) {
      this[key.toUpperCase()] = BITWISE[key];
    }
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
    let cb;

    if(params[params.length - 1] instanceof Function) {
      cb = params.pop(); 
    }

    // mutate as a level enabled getter, eg: log.info() determines
    // if the INFO level is enabled
    if(lvl !== undefined && msg === undefined) {
      return this.enabled(lvl); 
    }

    if(!this.enabled(lvl)) {
      return false; 
    }

    msg = this._formatter(lvl, msg, params);
    this.stream.write(msg, cb);
  }
}

/**
 *  Get an integer level for a bitwise level integer or a string level.
 *
 *  When a string is given then that level and all levels above it are 
 *  enabled.
 *
 *  If the given argument is not a valid log level identifier or integer 
 *  `undefined` is returned.
 *
 *  @static {function} getLevel
 *  @param {String|Number} [lvl] log level.
 *
 *  @returns an integer log level.
 */
function getLevel(lvl) {

  // got a level identifier
  if(lvl === String(lvl)) {

    // unknown level identifier - invalid
    if(BITWISE[lvl] === undefined) {
      return; 
    }

    if(lvl === NONE) {
      return BITWISE.none;
    }else if(lvl === ALL) {
      return BITWISE.all;
    }

    let i
      , k
      , v
      , match;

    // do not compare against `none` or `all`
    for(i = 1;i < KEYS.length - 1;i++) {
      k = KEYS[i].key;
      v = KEYS[i].value;

      // got the level match
      if(lvl === k) {
        match = v;
      // got subsequent levels to enable
      }else if(match !== undefined) {
        match |= v; 
      }
    }

    return match; 
  }else if(lvl === parseInt(lvl)) {
    return lvl;
  }
}

Logger.getLevel = getLevel;

for(let key in BITWISE) {
  // bitwise level constants
  Logger[key.toUpperCase()] = BITWISE[key];
  // string key constants
  Logger[key.toUpperCase() + '_KEY'] = key;
}


module.exports = Logger;
