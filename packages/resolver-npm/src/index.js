const path = require('path')
    , Resolver = require('trucks-resolver-core')
    , SCHEME = 'npm:'
    , INDEX = 'components.html'
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
    exec(cmd, cb);
  }

  /**
   *  @private
   */
  getLocalPath(pkg) {
    const type = pkg.type; 
    if(type === 'local') {
      return this.state.absolute(pkg.raw); 
    }else if(pkg.name) {
      // we will only be able to resolve if the package is installed
      try {
        // NOTE: by requiring `package.json` the module does not need
        // NOTE: an `index.js` or other main file
        return path.dirname(require.resolve(pkg.name + '/package.json'));
      }catch(e) {}

      return pkg.name;
    }
  }

  /**
   *  @private
   */
  readFile(file, cb) {
    const fs = require('fs');
    fs.readFile(file, cb);
  }

  getPackageDescriptor(file) {
    return require(file + '/package.json');
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
    if(localPath) {
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
    }

    if(needsInstall) {
      return this.install((err/*, stdout, stderr*/) => {
        if(err) {
          return cb(err);
        }

        // re-evaluate after install
        localPath = this.getLocalPath(pkg);
        file = this.getPackageMain(localPath);

        this.readFile(file, cb);
      });
    }else if(file) {
      this.readFile(file, cb);
    }
  }

  /**
   *  @private
   */
  parsePackage() {
    const npa = require('npm-package-arg');
    let href = this.href.replace(RE, ''); 
    return npa(href);
  }

  /**
   *  Compute the canonical path for the file.
   *
   *  @public {function} getCanonicalPath
   *
   *  @returns an absolute file system path.
   */
  getCanonicalPath() {
    let href = this.href
      , spec;
    href = href.replace(RE, ''); 

    const pkg = this.parsePackage()
        , type = pkg.type;

    if(type === 'hosted') {
      return pkg.hosted.https;
    }else if(type === 'local') {
      return this.state.absolute(href);
    // tag / version / range
    }else if(!pkg.hosted && pkg.name) {
      spec = pkg.rawSpec || 'latest';
      return pkg.name + '@' + spec;
    }

    // likely remote spec for 'git' type
    return pkg.raw;
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
