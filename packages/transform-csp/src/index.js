const crypto = require('crypto')
    , SHA256 = 'sha256'
    , SHA384 = 'sha384'
    , SHA512 = 'sha512'
    , HEX = 'hex'
    , BASE64 = 'base64'
    , NONCE = 'nonce'
    , SHA = [SHA256, SHA384, SHA512];

function getNonce(node, digest) {
  const hash = crypto.createHash('sha1');
  hash.update(Math.random().toString());
  return hash.digest(digest || HEX);
}

function getHash(node, algorithm) {
  return function() {
    const hash = crypto.createHash(algorithm || SHA256);
    hash.update(node.contents);
    return hash.digest(BASE64);
  }
}

/**
 *  Write `nonce` and `sha` content security policy attributes to inline 
 *  styles.
 *
 *  @public {function} csp
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {Boolean=true} [styles] generate csp attributes for styles.
 *  @option {Boolean=false} [scripts] generate csp attributes for scripts.
 *
 *  @returns map of visitor functions.
 *
 *  See https://www.w3.org/TR/CSP2/.
 */
module.exports = function csp(state, conf) {

  conf.styles = conf.styles !== undefined ? conf.styles : true;
  conf.scripts = conf.scripts !== undefined ? conf.scripts : false;

  const manifest = [];

  if(conf.sha && !~SHA.indexOf(conf.sha)) {
    throw new Error(
      `invalid sha value ${conf.sha}, expcting one of ${SHA.join(', ')}`); 
  }

  function policy(node, cb) {
    // only modify inline content
    if(!node.inline) {
      return cb();
    }

    let fn = getNonce
      , nonce = (conf.sha === undefined)
      , name = NONCE
      , val;

    if(conf.sha) {
      fn = getHash(node, conf.sha); 
    }

    if(fn) {
      val = fn(node);
      console.log('generate attribute value... %s', val); 
      manifest.push({id: nonce ? name : conf.sha, value: val});
      if(nonce) {
        let el = node.querySelectorAll(node.element);
        el.attr(name, val);
        node.contents = node.querySelectorAll.html(node.element);
        console.dir(node.contents);
      }
    }

    cb();
  }

  let visitors = {
    end: (node, cb) => {
      console.dir(manifest); 
      cb();
    }
  };

  if(conf.styles) {
    visitors.Style = policy;
  }

  if(conf.scripts) {
    visitors.Script = policy
  }

  return visitors;
}
