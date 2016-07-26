const HTML = 'html';

function plugin(compiler, options) {

  return function html(/*babel*/) {
    return {
      visitor: {
        CallExpression: (path) => {
          if(path.get("callee").isIdentifier({ name: HTML })
              && path.node.arguments.length === 1) {

            let evaluate = path.get("arguments")[0].evaluate();
            if(!evaluate.confident) {
              return;
            }

            let code = evaluate.value;
            if(typeof code !== "string") {
              return;
            }

            // NOTE: have to override so that new DOM is created
            options.vdom = null;

            const markup = '<template id="inline-html">' + code + '</template>'
                , inline = compiler.html(markup, options);

            path.replaceWithMultiple(inline[0].body.body);
          }
        }
      }
    }
  }

}

module.exports = plugin;
