const path = require('path')
    , Resolver = require('trucks-resolver-core')
    , SCHEME = 'file:'
    , RE = new RegExp('^' + SCHEME + '/?/?');

/**
 *  Resolve `file:` protocols.
 *
 *  @public {class} FileResolver
 */
class FileResolver extends Resolver {

  /**
   *  Create a file resolver.
   *
   *  @public {constructor} FileResolver
   */
  constructor() {
    super(...arguments);
  }

  /**
   *  Resolves file contents on the local file system using the canonical 
   *  path assigned to the `file` property.
   *
   *  @public {function} resolve
   *  @param {Function} cb callback function.
   */
  resolve(cb) {
    const fs = require('fs');
    fs.readFile(this.file, cb);
  }

  /**
   *  Compute the canonical path for the file.
   *
   *  When the file path is not absolute if this resolver has a parent file 
   *  then the file is resolved relative to the `dirname()` of the parent file.
   *
   *  If no parent resolver exists and the path is not absolute it is resolved 
   *  relative to the current working directory.
   *
   *  If the `href` begins with an explicit `file://` scheme it is stripped.
   *
   *  @public {function} getCanonicalPath
   *
   *  @returns an absolute file system path.
   */
  getCanonicalPath() {
    let base
      , href = this.href;
    if(this.parent && this.parent.file) {
      base = path.dirname(this.parent.file); 
    }
    href = href.replace(RE, ''); 
    return this.state.absolute(href, base);
  }
}

FileResolver.SCHEME = SCHEME;

/**
 *  Plugin for the file resolver.
 *
 *  Registers the resolver class for the `file:` protocol.
 *
 *  @public {function} file
 *  @param {Object} state compiler state.
 *  @param {Object} conf plugin configuration object.
 */
function file(/*state, conf*/) {
  return function(registry) {
    // set as registry default resolver when no scheme is specified
    registry.setDefault(FileResolver);

    // registry class for the `file:` scheme
    registry.register(SCHEME, FileResolver);
  }
}

file.Resolver = FileResolver;

module.exports = file;
