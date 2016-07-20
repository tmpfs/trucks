const fs = require('fs')
    , path = require('path');

/**
 *  Inject component styles from files.
 *
 *  @public {function} inject
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {String} [dir] input directory.
 *
 *  @returns map of visitor functions.
 */
function inject(state, conf) {
  const dir = conf.dir || state.options.out
      , components = state.components
      , Style = components.Style;

  let file
    , filename
    , href;

  function component(node, cb) {

    if(!(node instanceof state.components.Component)) {
      return cb(); 
    }

    // component module id becomes the name of the file
    filename = `${node.id}.css`;
    file = state.absolute(filename, dir);
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

        if(node.template) {
          // prepend style to primary template
          node.vdom(node.template.element)
            .prepend(`<style>${contents}</style>`);
        }

        //console.log(node.vdom.html(node.parent.element));

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
