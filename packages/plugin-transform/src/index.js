const PREFIX = 'trucks-transform-';

function visit(state, visitors, node, cb) {
  const components = state.components
      , File = components.File
      , Module = components.Module
      , Component = components.Component
      , Template = components.Template
      , Style = components.Style
      , Script = components.Script
      , COMPLETE = 'complete';

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
    (visitor, visited) => {
      let keys = Object.keys(visitor);
      state.each(
        keys, 
        (key, next) => {

          if(key === COMPLETE) {
            return next(); 
          }

          if(canVisit(key)) {
            // try to call the visitor function with the item
            try {
              return visitor[key](node, next); 
            }catch(e) {
              return next(e); 
            }
          }

          // not visiting this node
          next();
        },
        visited
      );
    }, 
    cb
  );
}

function plugin(state, conf) {
  //console.dir(conf);

  const visitors = conf.visitors || []
  
  if(!Array.isArray(visitors)) {
    throw new Error(`transform visitors array expected`); 
  }
  
  const list = state.getMiddleware(
    {
      phases: visitors,
      prefix: PREFIX,
      lookup: state.options.conf.transforms
    });

  return function transform(state, cb) {

    const tree = state.tree
        , items = [];

    // collect items to iterate
    // so we can do it async
    tree.iterator((item) => { items.push(item); });

    state.each(
      items,
      (item, next) => {
        visit(state, list, item, next);
      }, (err) => {
        if(err) {
          return cb(err);
        } 

        // call complete functions
        state.each(
          list,
          (visitor, next) => {
            if(visitor.complete instanceof Function) {
              return visitor.complete(next); 
            }
            next();
          }, cb);
      });
  }
}

module.exports = plugin;
