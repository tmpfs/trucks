const fs = require('fs')
    , path = require('path');

/**
 *  Inject component styles from files.
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
 *  @public {function} inject
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {String} [dir] input directory.
 *  @option {Object} [stylesheets] map of components to files.
 *
 *  @returns map of visitor functions.
 */
function inject(state, conf) {
  const dir = conf.dir || state.options.out
      , map = state.options.stylesheets || conf.stylesheets
      , components = state.components
      , Style = components.Style;

  let file
    , href;

  function component(node, cb) {

    if(!(node instanceof state.components.Component)) {
      return cb(); 
    }

    // component module id becomes the name of the file
    const filename = `${node.id}.css`;

    if(map && map[node.id]) {
      file = state.absolute(map[node.id], dir);
    }else{
      file = state.absolute(filename, dir);
    }

    href = path.join(dir, filename);

    fs.readFile(file, (err, contents) => {
      /* istanbul ignore next: tough to mock an error here */
      if(err && err.code !== 'ENOENT') {
        return cb(err); 
      } 

      if(contents) {

        contents = contents.toString();

        // clear existing styles
        node.clearStyles();

        // remove styles from DOM in the module context
        node.vdom('template > style', node.parent.element).remove();

        // NOTE: component instances are only created when there is a valid
        // NOTE: primary template

        // prepend style to primary template
        // reflected in the vdom
        node.vdom(node.template.element)
          .prepend(`<style>${contents}</style>`);

        // update the template contents when writing out templates
        // as HTML
        node.template.contents = node.vdom.html(node.template.element);

        node.styles.push(
          // mock an element
          new Style(
            state.parse(
              `<link rel="stylesheet" href="${href}">`)('link').get(0),
            contents,
            node,
            href
          )
        );
      }
      cb();
    })
  }

  return {
    leave: component
  }
}

inject.id = 'style-inject';

module.exports = inject;
