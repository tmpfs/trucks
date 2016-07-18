const MIME = 'text/stylus';

/**
 *  @private
 */
module.exports = function stylus(state, conf) {
  const processor = require('stylus')
    , opts = Object.create(conf);

  function style(node, cb) {
    if(node.type === MIME) {

      opts.filename = node.file || node.parent.file;

      processor.render(
        node.contents,
        opts,
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
