const MIME = 'text/sass';

/**
 *  @private
 */
module.exports = function sass(state, conf) {
  const processor = require('node-sass')
    , opts = Object.create(conf);

  function style(node, cb) {
    if(node.type === MIME) {

      opts.file = node.file || node.parent.file;
      opts.data = node.contents;

      processor.render(
        opts,
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
