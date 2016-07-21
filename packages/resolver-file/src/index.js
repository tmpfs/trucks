const path = require('path')
    , url = require('url')
    , SCHEME = 'file:';

class FileResolver {
  constructor(state, href, parent) {
    this.state = state;
    this.href = href;
    this.parent = parent;
    this.uri = url.parse(href);
  }

  /**
   *  Allows a resolver to modify the list of dependency imports.
   */
  getResolvedImports(list) {
    return list; 
  }

  /**
   *  Allows resolver implementations to load file content from a remote 
   *  resource.
   */
  getFileContents(cb) {
    const fs = require('fs')
        , file = this.getResolvedPath();
    fs.readFile(file, (err, contents) => {
      if(err) {
        return cb(err); 
      }
      return cb(null, contents);
    });
  }

  /**
   *  Allows resolvers for remote protocols to fetch resources from 
   *  the network.
   */
  fetch(cb) {
    cb(); 
  }

  /**
   *  Called after fetch has been invoked so that the resolver may return 
   *  a new filesystem path for downloaded content.
   */
  getResolvedPath() {
    return this.getCanonicalPath(); 
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
