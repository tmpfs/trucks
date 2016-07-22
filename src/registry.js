/**
 *  Registry for a mapping between protocol schemes and resolver classes.
 *
 *  @public {class} Registry
 */
class Registry {

  /**
   *  Create a new scheme registry.
   *
   *  @public {class} Registry
   */
  constructor() {
    this._schemes = {}; 
    // a default resolver to use when there is no scheme
    this._default = null;
  }

  /**
   *  Set the default scheme resolver.
   *
   *  @public {function} setDefault
   *  @param {Function} val resolver class.
   */
  setDefault(val) {
    this._default = val; 
  }

  /**
   *  Get the default scheme resolver.
   *
   *  Will be `null` if no plugins have registered a default handler by calling 
   *  the `setDefault` method.
   *
   *  @public {function} getDefault
   *  @returns a default resolver class.
   */
  getDefault() {
    return this._default;
  }

  /**
   *  Get the resolver class for a given scheme.
   *
   *  If the scheme is invalid (false) then a default scheme is returned, if no 
   *  default scheme has been registered the return value is `null`.
   *
   *  If a resolver is not declared for the scheme returns `undefined`.
   *
   *  @public {function} getResolver
   *  @param {String} scheme protocol scheme.
   *
   *  @returns a resolver class for the scheme.
   */
  getResolver(scheme) {
    //console.log('get resolver %s', scheme);
    if(!scheme) {
      return this.getDefault(); 
    }
    return this._schemes[scheme];
  }

  /**
   *  Register a resolver class for a scheme.
   *
   *  Scheme names should include a trailing colon.
   *
   *  @public {function} register
   *  @param {String} scheme protocol scheme.
   *  @param {Function} resolver constructor function.
   */
  register(scheme, type) {
    if(!(type instanceof Function)) {
      throw new Error(
        'constructor function expected when registering scheme'); 
    }
    this._schemes[scheme] = type;
  }

  /**
   *  Create a new resolver for an `href`.
   *
   *  @public {function} factory
   *  @param {Object} state compiler state.
   *  @param {String} href the URL to resolve.
   *  @param {Object} parent a parent resolver instance.
   */
  factory(state, href, parent) {
    let Type
      , resolver
      , url = require('url')
      , uri = url.parse(href);

    // inherit type from parent resolver
    if(parent && parent.protocol) {
      Type = this.getResolver(parent.protocol);
    // otherwise try to find for the protocol
    }else{
      Type = this.getResolver(uri.protocol);
    }

    // no resolver for the uri scheme
    if(uri.protocol && !Type) {
      throw new Error(
        `no resolver registered for scheme ${uri.protocol}`);
    }

    if(!Type) {
      throw new Error(
        `no import resolver class for href ${href} with no scheme`); 
    }

    resolver = new Type(state, href, parent);

    return resolver;
  }
}

module.exports = Registry;
