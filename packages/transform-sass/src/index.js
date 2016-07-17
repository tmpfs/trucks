const MIME = 'text/sass';

/**
 *  @private
 */
module.exports = function sass(/*state*/) {
  const processor = require('node-sass');

  function style(node, cb) {
    if(node.type === MIME) {
      processor.render(
        { 
          file: node.file || node.parent.file,
          data: node.contents 
        },
        (err, res) => {
          if(err) {
            return cb(err); 
          }
          node.contents = res.css.toString();
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
