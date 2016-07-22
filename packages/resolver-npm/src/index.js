const path = require('path')
    , Resolver = require('trucks-resolver-core')
    , npa = require('npm-package-arg')
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
    const exec = require('child_process').exec;
    const cmd = `npm i ${this.file}`;
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
      return this.state.absolute(path.join('node_modules', pkg.name)); 
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
      && descriptor.webcomponent
      && descriptor.webcomponents.main) {
      index = descriptor.webcomponents.main; 
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
        , pkg = this.parsePackage()
        , localPath = this.getLocalPath(pkg);

    let descriptor
      , version
      // resolved component index file
      , file
      , needsInstall = true;

    // try to determine an already installed version
    if(localPath) {
      //console.log('reading from local path %s', localPath);

      try {
        descriptor = this.getPackageDescriptor(localPath);
        file = this.getPackageMain(localPath);

        version = descriptor.version;
        if(version && pkg.spec && semver.valid(pkg.spec)) {
          if(semver.satisfies(version, pkg.spec)) {
            console.log('by pass install on satisfied semver');
            needsInstall = false; 
          } 
        }

      // it's ok it this fails, we'll try to install the dependeny
      }catch(e) {}
    }

    if(needsInstall) {
      return this.install((err) => {
        if(err) {
          return cb(err);
        }

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
    let href = this.href
    href = href.replace(RE, ''); 
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
