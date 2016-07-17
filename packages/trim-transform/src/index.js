/**
 *  @private
 */
module.exports = function transform(state) {

  // TODO: use conf argument
  const options = state.options.trim;

  function trim(node, cb) {

    // only configured to trim inline content
    if(!options || (options.inline && !node.inline)) {
      return cb();
    }

    // trim leading and trailing newlines
    if(options.newlines) {
      node.contents = node.contents.replace(/^\n+/, '');
      node.contents = node.contents.replace(/[\n ]+$/, '');
    }

    // trim every line
    if(options.lines && (options.pattern instanceof RegExp)) {
      let lines = node.contents.split('\n');
      lines = lines.map((line) => {
        return line.replace(options.pattern, ''); 
      })
      node.contents = lines.join('\n');
    }

    cb();
  }

  return {
    'Style': trim,
    'Script': trim
  }
}
