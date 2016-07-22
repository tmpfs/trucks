const url = require('url');

/**
 *  Abstract protocol resolver.
 *
 *  Resolver plugin implementations should create a subclass of this class and 
 *  invoke `registry.register()` with a protocol and the derived class.
 *
 *  @public {class} Resolver
 */
class Resolver {

  /**
   *  Create a resolver.
   *
   *  The `file` property is initialized to the canonical path for 
   *  the `href` argument.
   *
   *  @public {constructor} Resolver
   *  @param {Object} state compiler state.
   *  @param {String} href source URL to resolve.
   *  @param {Object} [parent] a parent resolver.
   *
   *  @throws TypeError attempting to parse a bad href argument.
   */
  constructor(state, href, parent) {

    // compiler state
    this.state = state;

    // raw href
    this.href = href;

    // parent resolver
    this.parent = parent;

    // throws on bad href arg
    this.uri = url.parse(href);

    // fully qualified file path
    this._file = this.getCanonicalPath();
  }

  /**
   *  Get the protocol from the `href` assigned to this 
   *  resolver, if no protocol is found lookup is performed 
   *  in a parent hierarchy.
   *
   *  @property {String} protocol 
   */
  get protocol() {
    if(!this.uri.protocol && this.parent) {
      return this.parent.protocol; 
    }
    return this.uri.protocol;
  }

  /**
   *  Absolute computed path for the URL.
   *
   *  This is initialized to the canonical path for the `href` argument 
   *  passed to the constructor but implementations may overwrite this.
   *
   *  @property {String} file
   */
  set file(val) {
    this._file = val; 
  }

  get file() {
    return this._file;
  }

  /**
   *  Resolve the contents for the URL.
   *
   *  Implementors should invoke callback with an error and `Buffer` contents:
   *  `(err, contents) => {}`.
   *
   *  @public {function} resolve
   *  @param {Function} cb callback function.
   */
  resolve(cb) {
    cb(null); 
  }

  /**
   *  Get a canonical path for the URL, used to determine if the 
   *  resource has already been processed.
   *
   *  Typically implementors would convert this to an absolute path or 
   *  absolute URL to ensure that duplicates can be resolved.
   */
  getCanonicalPath() {
    return this.href;
  }
}

module.exports = Resolver;
