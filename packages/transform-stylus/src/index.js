const MIME = 'text/stylus';

/**
 *  @private
 */
module.exports = function stylus(/*state*/) {
  const stylus = require('stylus');

  function style(node, cb) {
    if(node.type === MIME) {

      stylus.render(
        node.contents,
        { filename: node.file || node.parent.file },
        (err, css) => {
          if(err) {
            return cb(err); 
          }
          node.contents = css;
          cb()
        }
      );
    
    }else{
      cb();
    }
  }

  return {
    'Style': style
  }
}
