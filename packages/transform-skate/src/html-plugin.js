function plugin(compiler, options) {
  return function html(/*babel*/) {
    return {
      visitor: {
        CallExpression: (path) => {
          if(path.get("callee").isIdentifier({name: options.html})
              && path.node.arguments.length === 1) {

            const code = path.node.arguments[0].value;

            // NOTE: have to override so that new DOM is created
            options.vdom = null;

            const markup = `<template id="inline-html">${code}</template>`
                , inline = compiler.html(markup, options);

            path.replaceWithMultiple(inline[0].body.body);
          }
        }
      }
    }
  }

}

module.exports = plugin;
