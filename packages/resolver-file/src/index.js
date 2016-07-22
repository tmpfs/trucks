const path = require('path')
    , Resolver = require('trucks-resolver-core')
    , SCHEME = 'file:';

class FileResolver extends Resolver {
  constructor() {
    super(...arguments);
  }

  /**
   *  Allows resolver implementations to load file content from a remote 
   *  resource.
   */
  resolve(cb) {
    const fs = require('fs')
        //, file = this.getResolvedPath();
    fs.readFile(this.file, (err, contents) => {
      if(err) {
        return cb(err); 
      }
      return cb(null, contents);
    });
  }

  /**
   *  Get a canonical path for the URL reference, used to determine if the 
   *  resource has already been processed.
   */
  getCanonicalPath() {
    let base;
    if(this.parent && this.parent.file) {
      base = path.dirname(this.parent.file); 
    }
    return  this.state.absolute(this.href, base);
  }
}

FileResolver.SCHEME = SCHEME;

/**
 *  Resolver for the default file:// protocol.
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
