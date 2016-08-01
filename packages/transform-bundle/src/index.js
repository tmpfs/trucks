const fs = require('fs')
    , CSS = 'css'
    , HTML = 'html'
    , JS = 'js'
    , KEYS = [CSS, HTML, JS];

/**
 *  Add input files to the output templates, styles and scripts.
 *
 *  The default behaviour will prepend input files.
 *
 *  Use the `css`, `html` and `js` lists to prepend files to the 
 *  corresponding output file. You may also use a more explicit notation 
 *  with the `before` and `after` options to control whether bundled 
 *  files are appended or prepended.
 *
 *  @public {function} bundle
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {Object} [before] map of files to prepend.
 *  @option {Object} [after] map of files to append.
 *  @option {Array} [css] files to bundle with the stylesheet.
 *  @option {Array} [html] files to bundle with the templates.
 *  @option {Array} [js] files to bundle with the javascript.
 *
 *  @returns map of visitor functions.
 */
function bundle(state, conf) {

  const options = state.options
      , opts = options.bundle || conf;

  opts.before = opts.before || {};
  opts.after = opts.after || {};

  // top-level keys are prepended
  KEYS.forEach((nm) => {
    if(Array.isArray(opts[nm])) {
      opts.before[nm] = opts[nm]; 
    }
  })

  function end(node, cb) {
    state.each(
      KEYS,
      (key, next) => {
        let before = opts.before[key]
          , after = opts.after[key]
          , all
          , index
          , length
          , file;

        if(Array.isArray(before) || Array.isArray(after)) {
          before = before || []; 
          after = after || [];
          all = before.concat(after);
          length = before.length + after.length;

          // got a list of files to bundle
          if(length) {

            // get a reference to the corresponding output file
            file = state.getFile(options[key]);

            index = 0;

            // iterate the lists
            state.each(
              all,
              (href, next) => {
                let filepath = state.absolute(href, state.options.base);
                fs.readFile(filepath, (err, contents) => {
                  if(err) {
                    return next(err); 
                  } 

                  if(index < before.length) {
                    file.prepend(contents);
                  }else{
                    file.append(contents);
                  }
                  index++;
                  next(); 
                })
              },
              next
            )
          }else{
            next(); 
          }
        }else{
          next(); 
        }
      },
      cb
    );
  }

  return {end: end};
}

module.exports = bundle;
