function plugin(compiler, options, text) {
  return function html(babel) {
    const t = babel.types;
    return {
      visitor: {
        CallExpression: (path) => {
          if(path.get("callee").isIdentifier({name: options.html})
              && path.node.arguments.length === 1) {

            let arg = path.node.arguments[0]
              , code;

            if(t.isStringLiteral(arg)) {
              code = path.node.arguments[0].value;
            // NOTE: we need the string code for the template literal
            // NOTE: the easiest way to do this is extract from the source
            // NOTE: code base on loc position
            }else if(t.isTemplateLiteral(arg)) {
              const lines = text.split('\n')
                  , start = arg.loc.start.line - 1
                  , end = arg.loc.end.line - 1;
              let len;
              code = '';
              for(let i = start;i <= end;i++) {
                if(i === start) {
                  if(start === end) {
                    // NOTE: subtract for backticks
                    len = (arg.loc.end.column - arg.loc.start.column) - 2; 
                  }
                  // NOTE: add one to skip start backtick
                  code = lines[i].substr(arg.loc.start.column + 1, len);
                }

                if(i !== start && i !== end) {
                  code += lines[i];
                }
                if(i === end && (start !== end)) {
                  code += lines[i].substr(0, arg.loc.end.column - 1);
                }
              }

              //console.dir(code);
            }

            if(code) {
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

}

module.exports = plugin;
