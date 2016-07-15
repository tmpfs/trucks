function visit(state, visitors, item) {

  const components = state.components
      , File = components.File
      , Module = components.Module
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
        valid = (item instanceof File);
        break;
      case 'Module':
        valid = (item instanceof Module);
        break;
      case 'Template':
        valid = (item instanceof Template);
        break;
      case 'Style':
        valid = (item instanceof Style);
        break;
      case 'Script':
        valid = (item instanceof Script);
        break;
    }

    //console.log('valid %s', valid);

    return valid;
  }

  visitors.forEach((visitor) => {
    let key;
    for(key in visitor) {
      if(canVisit(key)) {
        // try to call the visitor function with the item
        visitor[key](item); 
      }  
    }
  })

}


function plugin(conf/*, state*/) {
  const visitors = conf.visitors;
  return function transform(state, cb) {

    if(!Array.isArray(visitors)) {
      return cb(new Error(`transform visitors array expected`)); 
    }

    const tree = state.tree;
    tree.iterator(
      (item) => {
        try {
          visit(state, visitors, item);
        }catch(e) {
          return cb(e); 
        }
      }
    )

    cb();
  }
}

module.exports = plugin;
