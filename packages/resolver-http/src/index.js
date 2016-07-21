const HTTP = 'http:'
    , HTTPS = 'https:'
    , url = require('url')
    , zlib = require('zlib')
    , http = require('http');

class HttpResolver {
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
    let called = false;

    function done(err, buf) {
      /* istanbul ignore next: guard against multiple events firing */
      if(called) {
        return; 
      }
      cb(err, buf);
      called = true;
    }

    // ensure we are resolved relative to a parent
    this.uri = url.parse(this.getCanonicalPath());

    if(!this.uri.protocol) {
      return cb(
        new Error('https resolver attempt to load with no protocol')); 
    }

    let pth = this.uri.pathname;

    const uri = url.format(this.uri)
        , options = {
            hostname: this.uri.hostname,
            port: this.uri.port,
            path: pth,
            headers: {
              'Accept': 'text/html'
            }
          };

    this.getDefaultPort(this.uri.protocol, options);

    const req = http.get(options, (res) => {
      // expecting 200 response
      if(res.statusCode !== 200) {
        return done(
          new Error(
            `unexpected status code ${res.statusCode} from ${uri}`));
      }

      const contentType = res.headers['content-type']
          , encoding = res.headers['content-encoding'];

      let gzip = false;

      if(!/text\/html/.test(contentType)) {
        return done(
          new Error(`unexpected content type ${contentType}`)) ;
      }

      if(encoding && ~encoding.indexOf('gzip')) {
        gzip = true;
      }

      let buf = new Buffer(0);

      // consume response body
      res.resume();

      res.on('data', (chunk) => {
        buf = Buffer.concat([buf, chunk], buf.length + chunk.length); 
      })

      // handle response error
      res.once('error', (err) => {
        /* istanbul ignore next: tough to mock repsonse stream error */
        done(err); 
      });

      res.once('end', () => {
        if(gzip) {
          zlib.gunzip(buf, (err, contents) => {
            /* istanbul ignore next: not going to mock zlib deflate error */
            if(err) {
              return done(err); 
            }
            done(null, contents); 
          });
        }else{
          done(null, buf); 
        }
      });
    })

    // handle request error
    req.once('error', (err) => {
      done(err); 
    })
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

  getDefaultPort(protocol, options) {
    if(!options.port) {
      if(protocol === HTTP) {
        options.port = 80;
      }else{
        options.port = 443;
      }
    }
    return options;
  }
}

HttpResolver.HTTP = HTTP;
HttpResolver.HTTPS = HTTPS;

/**
 *  Resolver for the default http:// and https:// protocols.
 */
function file(/*state, conf*/) {
  return function(registry) {
    registry.register(HTTP, HttpResolver);
    registry.register(HTTPS, HttpResolver);
  }
}

file.Resolver = HttpResolver;

module.exports = file;
