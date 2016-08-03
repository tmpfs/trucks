const PREFIX = 'trucks-transform-';

function runVisitor(state, visitors, node, cb) {
  const components = state.components
      , Tree = components.Tree
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
      case 'Tree':
        valid = (node instanceof Tree);
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
  // TODO: rename visitors -> transforms
  let visitors = state.options.transforms || conf.visitors || [];

  if(!Array.isArray(visitors)) {
    throw new Error(`transform visitors array expected`); 
  }

  if(Array.isArray(state.options.before.transforms)) {
    visitors = state.options.before.transforms.concat(visitors);
  }

  if(Array.isArray(state.options.after.transforms)) {
    visitors = visitors.concat(state.options.after.transforms);
  }

  state.log.debug('transforms %j', visitors);
  
  const list = state.middleware(
    {
      phases: visitors,
      prefix: PREFIX,
      lookup: state.options.conf.transforms
    }
  );

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
        , events = [];

    // collect events to iterate
    // so we can do it async
    tree.iterator((event) => {
      events.push(event);
    });

    function onEvent(visitors, node, cb) {
      state.each(
        visitors,
        (visitor, next) => {
          try {
            visitor(node, next); 
          }catch(e) {
            return next(e); 
          }
        },
        cb);
    }

    function visit(events, cb) {
      state.each(
        events,
        (event, next) => {
          if(event.entering) {

            // handle enter events
            if(lifecycle.enter.length) {
              onEvent(
                lifecycle.enter,
                event.node,
                (err) => {
                  if(err) {
                    return next(err); 
                  }  

                  // run visitors after enter lifecycle callbacks
                  runVisitor(state, list, event.node, next);
                }
              );
            }else{
              // no enter events - run the visitors
              runVisitor(state, list, event.node, next);
            }
          }else{
            // call leave lifecycle callbacks
            if(lifecycle.leave.length) {
              onEvent(lifecycle.leave, event.node, next);
            // nothing left to do - move on
            }else{
              next();
            }
          }
        }, (err) => {
          if(err) {
            return cb(err);
          } 

          // finished walking the tree
          onEvent(lifecycle.end, tree, cb);
        }
      );
    }

    if(lifecycle.begin.length) {
      // call begin lifecycle visitors
      onEvent(
        lifecycle.begin,
        tree,
        (err) => {
          if(err) {
            return cb(err); 
          }
          visit(events, cb);
        }
      );
    }else{
      visit(events, cb);
    }
  }
}

module.exports = transform;
