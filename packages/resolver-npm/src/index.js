const path = require('path')
    , Resolver = require('trucks-resolver-core')
    , SCHEME = 'npm:'
    , INDEX = 'components.html'
    , CONFIG = 'trucks.js'
    , RE = new RegExp('^' + SCHEME + '/?/?');

/**
 *  Resolve `npm:` protocols.
 *
 *  @public {class} NpmResolver
 */
class NpmResolver extends Resolver {

  /**
   *  Create an npm resolver.
   *
   *  @public {constructor} NpmResolver
   */
  constructor() {
    super(...arguments);
  }

  install(cb) {
    const exec = require('child_process').exec
        , cmd = `npm i ${this.file}`;
    this.state.log.info(cmd);
    exec(cmd, cb);
  }

  /**
   *  @private
   */
  getLocalPath(pkg) {
    const type = pkg.type; 
    if(type === 'local') {
      return this.state.absolute(pkg.raw); 
    /* istanbul ignore next: not going to mock hosted packages right now */
    }else if(type === 'hosted') {
      return pkg.hosted.https;
    }else{
      // we will only be able to resolve if the package is installed
      try {
        // NOTE: by requiring `package.json` the module does not need
        // NOTE: an `index.js` or other main file
        return path.dirname(require.resolve(pkg.name + '/package.json'));
      }catch(e) {
        // it's ok if the package is not already installed
      }
    }

    // remote or git or package not already installed
    return pkg.raw;
  }

  /**
   *  @private
   */
  readFile(file, descriptor, cb) {

    if(descriptor && !this.parent) {
      const config = this.getOptions(descriptor); 
      // defer to a separate compile pass with
      // the given options configuration
      if(config) {
        return cb(null, config); 
      }
    }

    const fs = require('fs');
    fs.readFile(file, cb);
  }

  getPackageDescriptor(file) {
    //try {
      return require(file + '/package.json');
    //}catch(e){}
  }

  getPackageIndex(descriptor) {
    let index = INDEX;
    if(descriptor
      && descriptor.main) {
      index = descriptor.main; 
    }

    return index;
  }

  getPackageMain(file) {
    const descriptor = this.getPackageDescriptor(file)
        , index = this.getPackageIndex(descriptor);
    return path.join(file, index);
  }

  /**
   *  Resolve web component HTML imports from npm packages.
   *
   *  @public {function} resolve
   *  @param {Function} cb callback function.
   */
  resolve(cb) {
    const semver = require('semver')
        , pkg = this.parsePackage();

    let descriptor
      , localPath = this.getLocalPath(pkg)
      , version
      // resolved component index file
      , file = this.file
      , needsInstall = true;

    // try to determine an already installed version
    try {
      // try to get the component index file to read
      file = this.getPackageMain(localPath);
      descriptor = this.getPackageDescriptor(localPath);

      // see if an install is needed
      version = descriptor.version;

      if(version && pkg.spec && semver.valid(pkg.spec)) {
        // bypass installation if the installed version 
        // satisfies the semver spec
        if(semver.satisfies(version, pkg.spec)) {
          needsInstall = false; 
        } 
      }

    // it's ok it this fails, we'll try to install
    }catch(e) {}

    if(needsInstall) {
      return this.install((err/*, stdout, stderr*/) => {
        if(err) {
          return cb(err);
        }

        // re-evaluate after install
        localPath = this.getLocalPath(pkg);
        file = this.getPackageMain(localPath);
        descriptor = this.getPackageDescriptor(localPath);

        this.readFile(file, descriptor, cb);
      });
    }else{
      this.readFile(file, descriptor, cb);
    }
  }

  getOptions(pkg) {
    try {
      let conf = require(pkg.name + '/' + CONFIG);
      // resolve paths relative to module base
      conf.base = path.dirname(require.resolve(pkg.name + '/' + CONFIG)); 
      return conf;
    // if no compiler options are found it's ok
    }catch(e) {}
  }

  /**
   *  @private
   */
  parsePackage() {
    if(!this._package) {
      const npa = require('npm-package-arg')
      let href = this.href.replace(RE, ''); 
      this._package = npa(href);
    }
    return this._package;
  }

  /**
   *  Compute the canonical path for the file.
   *
   *  @public {function} getCanonicalPath
   *
   *  @returns an absolute file system path.
   */
  getCanonicalPath() {
    return this.getLocalPath(this.parsePackage());
  }
}

NpmResolver.SCHEME = SCHEME;

/**
 *  Plugin for the npm resolver.
 *
 *  Registers the resolver class for the `npm:` protocol.
 *
 *  @public {function} npm
 *  @param {Object} state compiler state.
 *  @param {Object} conf plugin configuration object.
 */
function npm(/*state, conf*/) {
  return function(registry) {
    registry.register(SCHEME, NpmResolver);
  }
}

npm.Resolver = NpmResolver;

module.exports = npm;
