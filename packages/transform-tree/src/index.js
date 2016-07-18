/**
 *  @private
 */
module.exports = function tree(state/*, conf*/) {

  //get label() {
    //return '#' + this.id;
  //}

  //get nodes() {
    //return this.templates.concat(this.stylesheets).concat(this.scripts);
  //}

  const components = state.components
    , Tree = components.Tree
    , File = components.File
    , Module = components.Module
    , Component = components.Component
    , Template = components.Template
    , Style = components.Style
    , Script = components.Script;

  function Node(label, nodes) {
    this.label = label;
    this.nodes = nodes || [];
  }

  let root = new Node('.')
    , current = root
    , parents = [root];

  function isLeaf(node) {
    return (node instanceof Template)
      || (node instanceof Style) || (node instanceof Script);
  }

  return {
    enter: (node, cb) => {
      let newNode = null;
      if(node instanceof Tree) {
        return cb(); 
      }else if(node instanceof File) {
        newNode = new Node(node.file); 
      }else if(node instanceof Module) {
        newNode = new Node('Module#' + node.id); 
        console.log(node.templates.length);
      }else if(node instanceof Component) {
        newNode = new Node('Component#' + node.parent.id);

        // main template
        newNode.nodes.push(new Node('Template#' + node.id));

        // partials
        node.partials.forEach((template) => {
          newNode.nodes.push(new Node('Partial#' + template.id)); 
        })

        // local styles
        node.styles.forEach((style) => {
          newNode.nodes.push(new Node('Style#' + style.id)); 
        })

      }else if(node instanceof Template) {
        newNode = new Node('Template#' + node.id);
      }else if(node instanceof Style) {
        newNode = new Node('Style#' + node.id);
      }else if(node instanceof Script) {
        newNode = new Node('Script#' + node.id);
      }

      if(current && current.nodes && newNode) {
        current.nodes.push(newNode); 
      }

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
      if(root) {
        state.result.tree = archy(root);
        console.log();
        console.log(state.result.tree);
      }
      cb();
    }
  }
}
