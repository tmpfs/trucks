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
    // component module id becomes the name of the file
    filename = `${node.id}.css`;
    file = state.absolute(filename, dir);
    href = path.join(dir, filename);

    fs.readFile(file, (err, contents) => {
      /* istanbul ignore next: touch to mock an error here */
      if(err && err.code !== 'ENOENT') {
        return cb(err); 
      } 

      if(contents) {

        // clear existing styles
        node.clearStyles();

        node.styles.push(
          new Style(
            state.parse(
              `<link rel="stylesheet" href="${href}">`),
            contents.toString(),
            node,
            href
          )
        );
      }
      cb();
    })
  }

  return {
    Component: component
  }
}

inject.id = 'style-inject';

module.exports = inject;
