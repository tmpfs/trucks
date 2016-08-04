/**
 *  Output HTML files for component usage examples.
 *
 *  @public {function} usage
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {String=usage.html} [name] name of the output file.
 *  @option {Boolean=true} [main] write all usage examples to a main file.
 *  @option {Boolean=true} [file] write a file for each component module.
 *  @option {String} [dir] override the default output directory.
 *
 *  @returns map of visitor functions.
 */
function usage(state, conf) {
  
  const options = state.options
      , opts = options.usage || conf;

  let name = opts.name === String(opts.name) ? opts.name : 'usage.html'
    , main = opts.main !== undefined ? opts.main : true
    , file = opts.file !== undefined ? opts.file : true;

  function onModule(node, cb) {
    const selector = node.id
        , elements = node.vdom(selector).toArray();

    let componentName = node.id + '.' + name
      , mainFile
      , componentFile;

    if(main) {
      mainFile = state.getFile(name, opts.dir || options.out); 
    }

    if(file) {
      componentFile = state.getFile(componentName, options.dir || options.out); 
    }

    elements.forEach((el) => {
      const contents = node.vdom.html(el);
      if(mainFile) {
        mainFile.append(contents);
      }

      if(componentFile) {
        componentFile.append(contents);
      }
    })
    cb();
  }

  return {
    Module: onModule
  }
}

module.exports = usage;
