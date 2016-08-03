const fs = require('fs')
    , path = require('path')
    , EOL = require('os').EOL
    , mkparse = require('mkparse')
    , pi = require('mkparse/lang/pi');

function file(state, tag, instr, cb) {
  const pth = path.join(state.absolute(state.options.out), tag.name);

  if(state.hasFile(pth)) {
    return cb(null, state.getFile(pth).getFileContents());
  }

  cb(null, instr.comment.source);
}

const GRAMMAR = {
  file: file
}

class Instruction {
  constructor(grammar, comment) {
    this._grammar = grammar;
    this._comment = comment;
  }

  get grammar() {
    return this._grammar; 
  }

  get comment() {
    return this._comment;
  }

  exec(state, cb) {
    const result = this.comment.source;
    
    let k
      , i
      , tag;
    for(k in this.grammar) {
      for(i = 0;i < this.comment.tags.length;i++) {
        tag = this.comment.tags[i];
        if(tag.id === k) {
          return this.grammar[k](state, tag, this, cb);
        } 
      }
    }

    //
    cb(null, result);
  }

  toString() {
    return this.comment.source;
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
      , keys = Object.keys(files)
      , grammar = opts.grammar || GRAMMAR;

  function execute(parts, dest, cb) {
    const file = state.getFile(dest, options.out)
        , output = [];

    state.each(
      parts,
      (part, next) => {
        if(part instanceof Instruction) {
          part.exec(state, (err, content) => {
            if(err) {
              return next(err); 
            } 
            output.push(content);
            next();
          }); 
        // will be a string part, nothing to execute
        }else{
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

        // add processed contents to the output file buffer
        file.append(output.join(''));

        cb();
      }
    );
  }

  return (cb) => {
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
            let instr = new Instruction(grammar, comment);
            parts.push(instr);
            if(comment.newline) {
              parts.push(EOL);
            }
          });

          stream.on('finish', () => {
            // execute instructions
            execute(parts, dest, next);
          })
        })
      },
      cb
    );
  }
}

module.exports = page;
