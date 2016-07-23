/**
 *  Extract component styles to files.
 *
 *  When no `dir` option is given the default output directory is used.
 *
 *  When the stylesheets option is given it can be used to map component 
 *  identifiers to files.
 *
 *  ```javascript
 *  const options = {
 *    stylesheets: {
 *      'x-video': 'x-video-stylesheet.css'
 *    }
 *  }
 *  ```
 *
 *  When relative paths are used in the `stylesheets` map they are resolved 
 *  relative to the output directory.
 *
 *  @public {function} extract
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {String} [dir] output directory.
 *  @option {Object} [stylesheets] map of components to files.
 *
 *  @returns map of visitor functions.
 */
function extract(state, conf) {
  const dir = conf.dir || state.options.out
      , map = state.options.stylesheets || conf.stylesheets;

  let file;

  function component(node, cb) {
    // component module id becomes the name of the file
    const filename = `${node.id}.css`;

    if(map && map[node.id]) {
      file = state.getFile(map[node.id], dir); 
    }else{
      file = state.getFile(filename, dir);
    }
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
