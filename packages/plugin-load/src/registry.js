/**
 *  Registry for a mapping between protocol schemes and resolver classes.
 */
class Registry {
  constructor() {
    this.protocols = {}; 

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
      return this._default; 
    }
    return this.protocols[scheme];
  }

  register(scheme, type) {
    if(!(type instanceof Function)) {
      throw new Error(
        'constructor function expected when registering scheme'); 
    }
    this.protocols[scheme] = type;
  }
}

// singleton
module.exports = new Registry();
