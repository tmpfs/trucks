function visit(state, visitors, node, cb) {
  const components = state.components
      , File = components.File
      , Module = components.Module
      , Component = components.Component
      , Template = components.Template
      , Style = components.Style
      , Script = components.Script;

  function canVisit(key) {

    let valid = false;
    switch(key) {
      case '*':
        valid = true;
        break;
      case 'File':
        valid = (node instanceof File);
        break;
      case 'Module':
        valid = (node instanceof Module);
        break;
      case 'Component':
        valid = (node instanceof Component);
        break;
      case 'Template':
        valid = (node instanceof Template);
        break;
      case 'Style':
        valid = (node instanceof Style);
        break;
      case 'Script':
        valid = (node instanceof Script);
        break;
    }

    return valid;
  }

  state.each(
    visitors,
    // iterate list of visitors (transformations)
    (visitor, next) => {
      let keys = Object.keys(visitor);
      state.each(
        keys, 
        (key, next) => {
          if(canVisit(key)) {
            // try to call the visitor function with the item
            return visitor[key](node, next); 
          }
          // not visiting this node
          next();
        }, next);
    }, cb);
}


function plugin(conf, state) {
  const visitors = conf.visitors || []
    , list = visitors.map((visitor) => {
        if(visitor === String(visitor)) {
          visitor = require('trucks-plugin-' + visitor); 
        }
        return visitor(state); 
      })
  return function transform(state, cb) {

    if(!Array.isArray(visitors)) {
      return cb(new Error(`transform visitors array expected`)); 
    }

    const tree = state.tree
      , items = [];

    // collect items to iterate
    // so we can do it async
    tree.iterator((item) => { items.push(item); });

    state.each(
      items,
      (item, next) => {
        visit(state, list, item, next);
      }, cb)
  }
}

module.exports = plugin;
