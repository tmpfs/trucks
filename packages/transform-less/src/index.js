const MIME = 'text/less';

/**
 *  @private
 */
module.exports = function less(state, conf) {
  const processor = require('less')
    , opts = Object.create(conf);

  function style(node, cb) {
    if(node.type === MIME) {
      opts.filename = node.file || node.parent.file;
      processor.render(
        node.contents,
        opts,
        (err, res) => {
          if(err) {
            return cb(err); 
          }
          node.contents = res.css;
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
