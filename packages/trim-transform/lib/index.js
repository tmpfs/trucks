'use strict';

/**
 *  @private
 */
module.exports = function transform(state) {
  var options = state.options;
  function trim(node, cb) {

    // only configured to trim inline content
    if (!options || options.inline && !node.inline) {
      return;
    }

    // trim leading and trailing newlines
    if (options.newlines) {
      node.contents = node.contents.replace(/^\n+/, '');
      node.contents = node.contents.replace(/[\n ]+$/, '');
    }

    // trim every line
    if (options.lines && options.pattern instanceof RegExp) {
      var lines = node.contents.split('\n');
      lines = lines.map(function (line) {
        return line.replace(options.pattern, '');
      });
      node.contents = lines.join('\n');
    }
    cb();
  }

  return {
    'Template': trim,
    'Style': trim,
    'Script': trim
  };
};