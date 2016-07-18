function getLabel(tag, id, attrs) {
  let s = tag
    , a = '';

  if(id) {
    s += '#' + id;
  }
  s += ' '
  for(let k in attrs) {
    if(a) {
      a += ', ';
    }
    if(attrs[k] !== undefined) {
      a += k + '=' + attrs[k];
    }
  }
  if(a) {
    s += '(' + a + ')';
  }
  return s;
}

function Node(label, nodes) {
  this.label = label;
  this.nodes = Array.isArray(nodes) ? nodes : [];
}

/**
 *  @private
 */
module.exports = function tree(state, conf) {

  const components = state.components
    , Tree = components.Tree
    , File = components.File
    , Module = components.Module
    , Component = components.Component
    , Template = components.Template
    , Style = components.Style
    , Script = components.Script;

  let root = new Node('.')
    , current = root
    , parents = [root]
    , label = conf.label;

  if(!(label instanceof Function)) {
    label = getLabel; 
  }

  function createNode(tag, id, attrs, nodes) {
    return new Node(label(tag, id, attrs), nodes); 
  }

  function isLeaf(node) {
    return (node instanceof Template)
      || (node instanceof Style)
      || (node instanceof Script);
  }

  return {
    enter: (node, cb) => {
      let newNode = null;
      if(node instanceof Tree) {
        return cb(); 
      }else if(node instanceof File) {
        newNode = createNode(
          'file',
          node.id,
          {
            href: node.href,
            imports: node.imports.length,
            modules: node.modules.length
          }
      ); 
      }else if(node instanceof Module) {
        newNode = createNode(
          'module',
          node.id,
          {
            templates: node.templates.length,
            stylesheets: node.stylesheets.length,
            scripts: node.scripts.length
          }
        ); 
      }else if(node instanceof Component) {
        newNode = createNode(
          'component',
          node.id,
          {
            partials: node.partials.length,
            styles: node.styles.length
          },
          [
            createNode(
              'template',
              node.template.id,
              {
                type: node.template.type, href: node.template.href
              }
            )
          ]
        ); 

        // partials
        node.partials.forEach((template) => {
          newNode.nodes.push(
            createNode('partial', template.id, {type: node.type}));
        })

        // local styles
        node.styles.forEach((style) => {
          newNode.nodes.push(
            createNode('style', style.id, {type: node.type}));
        })

      }else if(node instanceof Template) {
        newNode = createNode(
          'template',
          node.id,
          {
            type: node.type,
            href: node.href
          }
        );
      }else if(node instanceof Style) {
        newNode = createNode(
          'style',
          node.id,
          {
            type: node.type,
            href: node.href
          }
        );
      /* istanbul ignore else: prefer to be explicit */
      }else if(node instanceof Script) {
        newNode = createNode(
          'script',
          node.id,
          {
            type: node.type,
            href: node.href
          }
        );
      }

      current.nodes.push(newNode); 

      if(!isLeaf(node)) {
        parents.push(newNode);
        current = newNode;
      }

      // components add their own children
      if((node instanceof Component)) {
        current = parents.pop(); 
      }

      cb();
    },
    leave: (node, cb) => {
      if(node instanceof Tree) {
        return cb(); 
      } 
      if(!isLeaf(node)) {
        current = parents.pop();
      }
      cb();
    },
    end: (tree, cb) => {
      const archy = require('archy');
      state.result.tree = {
        node: root,
        toString: () => {
          return archy(root);
        }
      }
      cb();
    }
  }
}
