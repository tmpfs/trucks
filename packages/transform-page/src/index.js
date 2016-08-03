const fs = require('fs')
    , EOL = require('os').EOL
    , mkparse = require('mkparse')
    , pi = require('mkparse/lang/pi');

/**
 *  Replace processing instructions in input files with markup.
 *
 *  @public {function} page
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {Array} files list of files to process.
 *
 *  @returns map of visitor functions.
 */
function page(state, conf) {

  const options = state.options
      , opts = options.page || conf
      , files = opts.files || {}
      , keys = Object.keys(files);

  function end(node, cb) {
    state.each(
      keys,
      (key, next) => {
        let filepath = state.absolute(key, state.options.base)
          , dest = files[key];
        fs.readFile(filepath, (err, contents) => {
          if(err) {
            return next(err); 
          } 

          let buf = '';
          contents = contents.toString();

          const stream = mkparse.parse(contents, {rules: pi});

          // pass through content chunks
          stream.on('content', function(source) {
            //console.dir(source);
            if(Array.isArray(source)) {
              buf += source.join(EOL) + EOL;
            }else{
              buf += source;
            }
          });

          // handle comment chunks (processing instructions)
          stream.on('comment', function(comment) {
            //console.dir(comment);
            buf += comment.source;
            if(comment.newline) {
              buf += EOL; 
            }
          });

          stream.on('finish', () => {
            buf = buf.replace(/\n+$/, '\n');
            const file = state.getFile(dest, options.out);
            file.append(buf);
            next();
          })
        })
      },
      cb
    );
  }

  return {end: end};
}

module.exports = page;
