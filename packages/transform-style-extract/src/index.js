/**
 *  Extract component styles to files.
 *
 *  @public {function} extract
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {String} [dir] output directory.
 *
 *  @returns map of visitor functions.
 */
function extract(state, conf) {
  const dir = conf.dir || state.options.out;

  let file
    , filename;

  function component(node, cb) {
    // component module id becomes the name of the file
    filename = `${node.id}.css`;
    file = state.getFile(filename, dir);
    cb();
  }

  function style(node, cb) {

    // do not process styles that are not a shadow scope
    if(!node.isShadowScope()) {
      return cb(); 
    }
    file.append(node.contents);
    cb();
  }

  return {
    Component: component,
    Style: style
  }
}

extract.id = 'style-extract';

module.exports = extract;
