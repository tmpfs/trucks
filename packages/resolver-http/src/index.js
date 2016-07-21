const HTTP = 'http:'
    , HTTPS = 'https:'
    , url = require('url')
    , http = require('http');

class HttpResolver {
  constructor(state, href, uri, parent) {
    this.state = state;
    this.href = href;
    this.uri = uri;
    this.parent = parent;
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
    let called = false;

    function done(err) {
      if(called) {
        return; 
      }
      cb(err);
      called = true;
    }

    // ensure we are resolved relative to a parent
    this.uri = url.parse(this.getCanonicalPath());

    if(!this.uri.protocol) {
      return cb(
        new Error('https resolver attempt to load with no protocol')); 
    }

    let pth = this.uri.pathname;

    if(!/^\//.test(pth)) {
      pth = '/' + pth;
    }

    const options = {
      hostname: this.uri.hostname,
      port: this.uri.port,
      path: pth
    }

    if(!options.port) {
      if(this.uri.protocol === HTTP) {
        options.port = 80;
      }else{
        options.port = 443;
      }
    }

    console.dir(options);

    const req = http.get(options, (res) => {
      console.log(`Got response: ${res.statusCode}`);
      // consume response body
      res.resume();
      //console.dir(res); 

      done();
    })

    req.once('error', (err) => {
      done(err); 
    })

    //fs.readFile(file, (err, contents) => {
      //if(err) {
        //return cb(err); 
      //}
      //return cb(null, contents);
    //});
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
    if(!this.uri.protocol && this.parent) {
      const href = this.parent.file; 
      // TODO: implement this properly
      return href + '/' + this.href;
    }
    // should be an absolute HTTP/HTTPS URL
    return this.href;
  }
}

HttpResolver.HTTP = HTTP;
HttpResolver.HTTPS = HTTPS;

/**
 *  Resolver for the default file:// protocol.
 */
function file(/*state, conf*/) {
  return function(registry) {
    registry.register(HTTP, HttpResolver);
    registry.register(HTTPS, HttpResolver);
  }
}

file.Resolver = HttpResolver;

module.exports = file;
