/**
 *  @private
 */
module.exports = function trim(state, conf) {

  conf.inline = conf.inline !== undefined ? conf.inline : true;
  conf.newlines = conf.newlines !== undefined ? conf.newlines : true;
  conf.lines = conf.lines !== undefined ? conf.lines : true;
  conf.pattern = (conf.pattern instanceof RegExp)
    ? conf.pattern : /^(  |\t){2,2}/;

  function strip(node, cb) {

    // only configured to trim inline content
    if(!conf || (conf.inline && !node.inline)) {
      return cb();
    }

    // trim leading and trailing newlines
    if(conf.newlines) {
      node.contents = node.contents.replace(/^\n+/, '');
      node.contents = node.contents.replace(/[\n ]+$/, '');
    }

    // trim every line
    if(conf.lines && (conf.pattern instanceof RegExp)) {
      let lines = node.contents.split('\n');
      lines = lines.map((line) => {
        return line.replace(conf.pattern, ''); 
      })
      node.contents = lines.join('\n');
    }

    cb();
  }

  return {
    'Style': strip,
    'Script': strip
  }
}
