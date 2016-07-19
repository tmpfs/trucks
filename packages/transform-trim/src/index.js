const TEMPLATE = 'template';

/**
 *  Removes leading and trailing whitespace from inline styles and scripts.
 *
 *  When the `lines` option is given each line is stripped of leading 
 *  whitespace that matches the `pattern` regular expression.
 *
 *  @public {function} trim
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {Boolean=true} [inline] only replace inline elements.
 *  @option {Boolean=true} [lines] strip each line.
 *  @option {Boolean=false} [templates] also trim template elements.
 *
 *  @returns map of visitor functions.
 */
module.exports = function trim(state, conf) {

  conf.inline = conf.inline !== undefined ? conf.inline : true;
  conf.lines = conf.lines !== undefined ? conf.lines : true;
  conf.templates = conf.templates !== undefined ? conf.templates : false;

  const documentScope = /^(  |\t){2,2}/
      , shadowScope = /^(  |\t){3,3}/;

  function strip(node, cb) {
    // only configured to trim inline content
    if(!conf || (conf.inline && !node.inline)) {
      return cb();
    }

    let pattern = documentScope;

    // additional indentation level
    if(node.element
      && node.element.parent
      && node.element.parent.name === TEMPLATE) {
      pattern = shadowScope; 
    }

    // trim leading and trailing whitespace
    node.contents = node.contents.trim();

    // trim every line
    if(conf.lines) {
      let lines = node.contents.split('\n');
      lines = lines.map((line) => {
        return line.replace(pattern, ''); 
      })
      node.contents = lines.join('\n');
    }

    cb();
  }

  let visitors = {
    Style: strip,
    Script: strip
  }

  if(conf.templates) {
    visitors.Template = strip;
  }

  return visitors;
}
