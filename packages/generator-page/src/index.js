const path = require('path')
    , EOL = require('os').EOL
    , mkparse = require('mkparse')
    , pi = require('mkparse/lang/pi');

function file(state, tag, instr, cb) {
  const pth = path.join(state.absolute(state.options.out), tag.name);
  if(state.hasFile(pth) || state.hasFile(tag.name, state.options.out)) {
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
          try {
            return this.grammar[k](state, tag, this, cb);
          }catch(e) {
            return cb(e); 
          }
        } 
      }
    }

    cb(null, result);
  }
}

/**
 *  Replace processing instructions in input files with markup.
 *
 *  By default a grammar is used that maps the `@file` tag to a `file` function 
 *  which looks in the compiler state `output` to see if a matching output file 
 *  exists; if the file exists the processing instruction is replaced with the 
 *  file contents.
 *
 *  @public {function} page
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {Object} files map of files to process.
 *  @option {Object} [grammar] alternative map of tag functions.
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

  return (state, cb) => {
    state.each(
      keys,
      (key, next) => {
        let filepath = state.absolute(key, state.options.base)
          , dest = files[key];

        let parts = [];

        const stream = mkparse.load(filepath, {rules: pi});

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

        stream.once('error', (err) => {
          next(err);
        })

        stream.on('finish', () => {
          // execute instructions
          execute(parts, dest, next);
        })

      },
      cb
    );
  }
}

module.exports = page;
