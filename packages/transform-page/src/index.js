const fs = require('fs')
    , EOL = require('os').EOL
    , mkparse = require('mkparse')
    , pi = require('mkparse/lang/pi');

class Instruction {
  constructor(comment) {
    this._comment = comment;
  }

  exec(cb) {
    //console.log('exec instr');
    cb(null, this._comment.source);
  }
}

/**
 *  Replace processing instructions in input files with markup.
 *
 *  @public {function} page
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {Object} files map of files to process.
 *
 *  @returns map of visitor functions.
 */
function page(state, conf) {

  const options = state.options
      , opts = options.page || conf
      , files = opts.files || {}
      , keys = Object.keys(files);

  function process(parts, dest, cb) {
    const file = state.getFile(dest, options.out)
        , output = [];

    state.each(
      parts,
      (part, next) => {
        if(part instanceof Instruction) {
          part.exec((err, content) => {
            if(err) {
              return next(err); 
            } 
            output.push(content);
            next();
          }); 
        }else if(part === String(part)) {
          output.push(part);
          next(); 
        } 

      },
      (err) => {
        if(err) {
          return cb(err); 
        }

        // handle double newline at eof
        const last = output[output.length - 1];
        if(last === '\n' && /\n/.test(output[output.length - 2])) {
          output.pop(); 
        }

        file.append(output.join(''));
        cb();
      }
    );
  }

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

          let parts = [];
          contents = contents.toString();

          const stream = mkparse.parse(contents, {rules: pi});

          // pass through content chunks
          stream.on('content', function(source) {
            let s = '';
            if(Array.isArray(source)) {
              s += source.join(EOL) + EOL;
            }else{
              s += source;
            }
            parts.push(s);
          });

          // handle comment chunks (processing instructions)
          stream.on('comment', function(comment) {
            let instr = new Instruction(comment, contents.length);
            parts.push(instr);
            if(comment.newline) {
              parts.push(EOL);
            }
          });

          stream.on('finish', () => {
            process(parts, dest, next);
          })
        })
      },
      cb
    );
  }

  return {end: end};
}

module.exports = page;
