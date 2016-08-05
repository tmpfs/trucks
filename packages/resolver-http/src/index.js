const HTTP = 'http:'
    , HTTPS = 'https:'
    , Resolver = require('trucks-resolver-core')
    , url = require('url')
    , types = [
        // github raw sends HTML as text/plain :(
        'text/plain',
        'text/html',
        'application/javascript',
        'text/css'
      ];

/**
 *  Resolve `http:` and `https:` protocols.
 *
 *  @public {class} HttpResolver
 */
class HttpResolver extends Resolver {

  /**
   *  Create an HTTP resolver.
   *
   *  @public {constructor} HttpResolver
   */
  constructor() {
    super(...arguments);

    // include default port when getting canonical path
    this.getDefaultPort(this.uri.protocol, this.uri);
  }

  /**
   *  Determine if a response content type can be processed.
   *
   *  @private {function} isValidContentType
   *  @param {String} type the response content type.
   *
   *  @returns Boolean indicating whether the content type is acceptable.
   */
  isValidContentType(type) {
    let i = 0;
    for(;i < types.length;i++) {
      if(~type.indexOf(types[i])) {
        return true; 
      } 
    } 
    return false;
  }

  /**
   *  Loads a remote HTTP resource from the network and invokes 
   *  callback with the response body.
   *
   *  If the response has a `Content-Encoding` containing gzip it is deflated.
   *
   *  @public {function} resolve
   *  @param {Function} cb callback function.
   */
  resolve(cb) {
    const zlib = require('zlib');
        //, http = require('http');

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
        new Error('resolver attempt to load with no protocol')); 
    }

    let pth = this.uri.pathname;

    const uri = url.format(this.uri)
        , options = {
            hostname: this.uri.hostname,
            port: this.uri.port,
            path: pth,
            headers: {
              'Accept': 'text/*, application/*'
            }
          };

    this.getDefaultPort(this.uri.protocol, options);

    /* istanbul ignore next: not going to mock https: server */
    const transport = this.uri.protocol === HTTPS
      ? require('https') : require('http');

    const req = transport.get(options, (res) => {

      // TODO: handle redirects
      //if(res.statusCode === 301) {
        //console.log(res.headers); 
      //}

      // expecting 200 response
      if(res.statusCode !== 200) {
        return done(
          new Error(
            `unexpected status code ${res.statusCode} from ${uri}`));
      }

      const contentType = res.headers['content-type']
          , encoding = res.headers['content-encoding'];

      let gzip = false;

      if(!this.isValidContentType(contentType)) {
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
   *  Get a canonical path for the URL reference, used to determine if the 
   *  resource has already been processed.
   */
  getCanonicalPath() {
    // no scheme with a parent, resolve relative to the parent
    if(!this.uri.protocol && this.parent && this.parent.file) {
      return url.resolve(this.parent.file, this.href);
    }

    // should be an absolute HTTP/HTTPS URL
    return url.format(this.uri);
  }

  /**
   *  Injects a default port for the `http:` and `https:` protocols.
   *
   *  Used for requests and generating canonical URLs.
   *
   *  @private {function} getDefaultPort
   *  @param {String} protocol parsed protocol.
   *  @param {Object} target the object to receive the `port` property.
   *
   *  @returns the input target object.
   */
  getDefaultPort(protocol, target) {
    if(!target.port) {
      if(protocol === HTTP) {
        target.port = 80;
      }else{
        target.port = 443;
      }
    }
    return target;
  }
}

HttpResolver.HTTP = HTTP;
HttpResolver.HTTPS = HTTPS;

/**
 *  Plugin for the http resolver.
 *
 *  Registers the resolver class for the `http:` and `https:` protocols unless 
 *  the `secure` option is given in which case the `http:` protocol is not 
 *  registered and attempts to use `http:` URLs in HTML imports will generate 
 *  errors.
 *
 *  @public {function} http
 *  @param {Object} state compiler state.
 *  @param {Object} conf plugin configuration object.
 *  @option {Boolean=false} secure only use `https:`.
 */
function http(state, conf) {
  return function(registry) {
    if(!conf.secure) {
      registry.register(HTTP, HttpResolver);
    }
    registry.register(HTTPS, HttpResolver);
  }
}

http.Resolver = HttpResolver;

module.exports = http;
