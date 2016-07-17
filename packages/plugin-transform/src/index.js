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

function transform(state, conf) {
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

  // collect lifecycle mappings
  const lifecycle = {
    begin: [],
    enter: [],
    leave: [],
    end: []
  }

  list.forEach((item) => {

    if(item.begin) {
      lifecycle.begin.push(item.begin); 
      delete item.begin;
    } 

    if(item.enter) {
      lifecycle.enter.push(item.enter); 
      delete item.enter;
    } 

    if(item.leave) {
      lifecycle.leave.push(item.leave); 
      delete item.leave;
    } 

    if(item.end) {
      lifecycle.end.push(item.end); 
      delete item.end;
    } 
  })

  return function transform(state, cb) {

    const tree = state.tree
        , items = [];

    // collect items to iterate
    // so we can do it async
    tree.iterator((item) => { items.push(item); });

    function exec(visitors, cb) {
      state.each(
        visitors,
        (item, next) => {
          visit(state, list, item, next);
        }, (err) => {
          if(err) {
            return cb(err);
          } 

          // finished walking the tree
          state.each(
            lifecycle.end,
            (visitor, next) => {
              visitor(tree, next); 
            },
            cb);
        }
      );
    }

    if(lifecycle.begin.length) {
      // finished walking the tree
      state.each(
        lifecycle.begin,
        (visitor, next) => {
          visitor(tree, next); 
        },
        (err) => {
          if(err) {
            return cb(err); 
          }
          exec(items, cb);
        });
    }else{
      exec(items, cb);
    }
  }
}

module.exports = transform;
