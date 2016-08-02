const path = require('path')
    , fs = require('fs');

/**
 *  Copy input files to the output directory.
 *
 *  Files are defined using an input mapping:
 *
 *  ```javascript
 *  {
 *    copy: {
 *      files: {
 *        'src/index.html': 'index.html'
 *      }
 *    }
 *  }
 *  ```
 *
 *  Input files are the keys and are resolved relative to the `base` option. 
 *  The values are output paths relative to the compiler output directory.
 *
 *  @public {function} copy
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {Object} [files] map of files to copy.
 *  @option {String} [base] base path for relative input files.
 *
 *  @returns map of visitor functions.
 */
function copy(state, conf) {
  const options = state.options
      , opts = options.copy || conf
      , files = opts.files || {}
      , keys = Object.keys(files);

  function end(node, cb) {
    state.each(
      keys,
      (input, next) => {
        let output = files[input];
       
        input = state.absolute(input, opts.base);

        //console.dir(input);
        //console.dir(output);

        // noop: source and destination are the same
        if(input === state.absolute(output, state.absolute(options.out))) {
          return next(); 
        }

        if(path.isAbsolute(output)) {
          output = path.basename(output); 
        }

        // create output file
        const file = state.getFile(output, options.out);

        fs.readFile(input, (err, contents) => {
          if(err) {
            return next(err); 
          } 
          file.contents = [contents.toString()];
          next();
        })
      },
      cb
    );
  }

  return {end: end};
}

module.exports = copy;
