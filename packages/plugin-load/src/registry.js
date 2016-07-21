/**
 *  Registry for a mapping between protocol schemes and resolver classes.
 */
class Registry {
  constructor() {
    this._schemes = {}; 
    // a default resolver to use when there is no scheme
    this._default = null;
  }

  setDefault(val) {
    this._default = val; 
  }

  getDefault() {
    return this._default;
  }

  getResolver(scheme) {
    if(!scheme) {
      return this.getDefault(); 
    }
    return this._schemes[scheme];
  }

  register(scheme, type) {
    if(!(type instanceof Function)) {
      throw new Error(
        'constructor function expected when registering scheme'); 
    }
    this._schemes[scheme] = type;
  }

  factory(state, href, parent) {
    let Type
      , resolver
      , url = require('url')
      , uri = url.parse(href);

    Type = this.getResolver(uri.protocol);

    // no resolver for the uri scheme
    if(uri.protocol && !Type) {
      throw new Error(
        `no resolver registered for scheme ${uri.protocol}`);
    }

    if(!Type) {
      throw new Error(
        `could not get import resolver type for scheme ${uri.protocol}`); 
    }

    resolver = new Type(state, href, parent);

    return resolver;
  }
}

// singleton
module.exports = new Registry();
