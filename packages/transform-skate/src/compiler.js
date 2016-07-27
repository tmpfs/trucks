const PATTERN = /\$\{([^}]+)\}/
    // name of the compile time html function for inline scripts
    , HTML = 'html'
    , TAG = 'tag'
    , STYLE = 'style'
    , SCRIPT = 'script'
    , ID = 'id'
    , SKATE = 'skate'
    , VDOM = 'vdom'
    , RENDER = 'render'
    , ELEM = 'elem'
    , ELEMENT = 'element'
    , TEXT = 'text'
    , TEMPLATES = 'templates' 
    , MAIN = 'template'
    , TAG_NAME = 'tagName'
    , TO_LOWER_CASE = 'toLowerCase'
    , DATA_KEY = 'data-key'
    , DATA_SKIP = 'data-skip'
    , DATA_STATIC = /^data-static-(.+)/;

/**
 *  Utility to determine if an object is empty.
 *
 *  @private
 */
function isEmpty(obj) {
  let key;
  for(key in obj) {
    return false;
  }
  return true;
}

/**
 *  Get computed compiler options.
 *
 *  Merges input compiler options with the default option configuration.
 *
 *  @function options
 *  @param {Object} opts processing options.
 *
 *  @option {String=id} [attr] attribute name used for the component id.
 *  @option {String=skate} [skate] name of the skatejs variable.
 *  @option {String=vdom} [idom] name of the vdom property.
 *  @option {String=element} [element] name of the element function.
 *  @option {String=text} [text] name of the text function.
 *  @option {String=templates} [templates] name of the templates map.
 *  @option {String=template} [main] name of the main function.
 *  @option {Boolean=true} [scripts] parse template script elements.
 *  @option {String=html} [html] name of the `html` function for inline scripts.
 *  @option {Boolean=true} [normalize] normalize whitespace in templates.
 *  @option {Object|Boolean=true} [literals] flags for template literal support.
 *  @option {Object} [dom] options to use when parsing the DOM.
 *
 *  @returns computed processing options.
 */
function options(opts) {
  opts = opts || {};

  opts.dom = opts.dom || {};

  if(opts.normalize === undefined) {
    opts.normalize = true; 
  }else{
    opts.normalize = Boolean(opts.normalize);
  }

  if(opts.normalize) {
    opts.dom.normalizeWhitespace = true; 
  }

  opts.scripts = opts.scripts !== undefined ? opts.scripts : true;
  opts.literals = opts.literals !== undefined ? opts.literals : true;

  // truthy enable all template literals
  if(opts.literals && opts.literals !== Object(opts.literals)) {
    opts.literals = {text: true, attribute: true}; 
  }

  // must have an object for dot property access
  if(opts.literals !== Object(opts.literals)) {
    opts.literals = {}; 
  }

  opts.babel = opts.babel || {};

  opts.attr = opts.attr || ID;

  opts.skate = opts.skate || SKATE;
  opts.idom = opts.idom || VDOM;
  opts.element = opts.element || ELEMENT;
  opts.text = opts.text || TEXT;

  opts.name = opts.name || RENDER;
  opts.arg = opts.arg || ELEM;

  opts.main = opts.main || MAIN;
  opts.templates = opts.templates || TEMPLATES;

  opts.html = opts.html || HTML;

  return opts;
}

/**
 *  Compile an HTML string to AST programs representing each `<template>` 
 *  element in the input HTML.
 *
 *  Template literal support is enabled by default. You can pass the 
 *  `literals` option as `false` to disable template literals for attributes and 
 *  text nodes or an object that configures the `text` and `attribute` flags.
 *
 *  The following examples are equivalent:
 *
 *  ```javascript
 *  html(tpl, {literals: false});
 *  html(tpl, {literals: {text: false, attribute: false});
 *  ```
 *
 *  @function html
 *  @param {String} html an HTML string.
 *  @param {Object} opts processing options.
 *
 *  @throws Error if a template element does not define an identifier.
 *
 *  @returns a list of compiled templates.
 */
function html(html, opts) {
  opts = options(opts);

  if(!opts.vdom) {
    const cheerio = require('cheerio');
    opts.vdom = cheerio.load(html, opts.dom);
  }

  const templates = []
    , elements = opts.vdom('template');

  elements.each((i, el) => {
    templates.push(render(el, opts));
  })

  return templates;
}

function partial(opts) {
  opts = options(opts);
  const template =
      `function partial(id) {
        return templates[elem.tagName.toLowerCase() + '-' + id].call(elem, elem);
      }`
      , babel = require('babel-core');
  return babel.transform(template, opts.babel);
}

/**
 *  Build a main function that accepts an `elem` argument and performs a 
 *  lookup in the templates map to execute the template function.
 *
 *  @public {function} main
 *  @param {Object} opts processing options.
 *
 *  @returns program representing the main function.
 */
function main(opts) {
  const t = require('babel-core').types;
  opts = options(opts);

  // main function declaration
  let expr = t.functionDeclaration(
      t.identifier(opts.main),
      [t.identifier(ELEM)],
      t.blockStatement(
        [
          t.returnStatement(
            t.callExpression(
              t.memberExpression(
                t.memberExpression(
                  t.identifier(opts.templates),
                  t.callExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.identifier(ELEM),
                        t.identifier(TAG_NAME)
                      ),
                      t.identifier(TO_LOWER_CASE)
                    ),
                    []
                  ),
                  true
                ),
                t.identifier('call')
              ),
              [t.identifier(ELEM), t.identifier(ELEM)]
            )  
          )
        ] 
      )
    );

  return t.program([expr]);
}

/**
 *  Converts the output of a compile pass to an object map of component 
 *  identifiers to render functions.
 *
 *  @public {function} map
 *  @param {Array} templates list of compiled template programs.
 *  @param {Object} opts processing options.
 *
 *  @returns {Object} AST program mapping components to render functions.
 */
function map(templates, opts) {
  opts = options(opts);

  let out = [];

  const t = require('babel-core').types;

  templates.forEach((tpl) => {
    let expr = t.functionExpression(
      t.identifier(opts.name),
      [t.identifier(opts.arg)], t.blockStatement(tpl.body.body));

    // NOTE: must use stringLiteral() rather than identifier() to quote
    // NOTE: the object property which must contain a hyphen for component
    // NOTE: tag names
    out.push(
      t.objectProperty(t.stringLiteral(tpl.id), expr)
    );
  })
  const program = t.variableDeclaration(
    'const', 
    [
      t.variableDeclarator(
        t.identifier(opts.templates),
        t.objectExpression(out)
      )
    ]
  )
  return t.program([program]);
}

/**
 *  Get an object expression from a javascript object.
 *
 *  Designed for the attributes map so only support ObjectProperty 
 *  expressions and assumes all values are string literals.
 *
 *  @private {function} getObjectExpression
 *  @param {Object} t the babel types object.
 *  @param {Object} map the object to convert to an AST expression.
 *  @param {Function} it iterator function to transform property values.
 */
function getObjectExpression(t, map, it) {
  const out = [];
  let val;

  if(map === String(map)) {
    return it(null, map); 
  }

  function onArray(item) {
    val.push(getObjectExpression(t, item, it)); 
  }

  for(let k in map) {
    if(Array.isArray(map[k])) {
      val = [];
      map[k].forEach(onArray);
      val = t.arrayExpression(val);
    }else{
      val = it(k, map[k]);
    }
    out.push(
      t.objectProperty(t.stringLiteral(k), val)
    );
  }
  return t.objectExpression(out);
}

/**
 *  Get a function call expression for defining vdom elements.
 *
 *  Functions are called on the `skate.vdom` member.
 *
 *  @private {function} getCallExpression
 *  @param {Object} t the babel types object.
 *  @param {String} method the name of the function to call (eg: element).
 *  @param {Array} args the argument list for the function call.
 */
function getCallExpression(t, method, args) {
  const expr =
    t.callExpression(
      // callee
      t.memberExpression(
        // object
        t.memberExpression(
          // object
          t.identifier(SKATE),
          // property
          t.identifier(VDOM)
        ),
        // property
        t.identifier(method)
      ),
      // arguments
      args
    );
  return expr;
}

/**
 *  Inject a `key` idom property from a `data-key` attribute. 
 *
 *  @private {function} key
 */
function key(prop, value, attrs) {
  if(prop === DATA_KEY && value === String(value)) {
    attrs.key = value;
    delete attrs[prop];
  }
  return attrs;
}

/**
 *  Inject a `skip` idom property from a `data-skip` attribute. 
 *
 *  @private {function} skip
 */
function skip(prop, value, attrs) {
  if(prop === DATA_SKIP) {
    attrs.skip = true;
    delete attrs[prop];
  }
  return attrs;
}

/**
 *  Inject a `statics` idom property from `data-static-*` attributes.
 *
 *  @private {function} statics
 */
function statics(prop, value, attrs) {
  let key;
  if(DATA_STATIC.test(prop)) {
    key = prop.replace(DATA_STATIC, '$1');
    attrs.statics = attrs.statics || [];
    attrs.statics.push(key);
    attrs[key] = value;
    delete attrs[prop];
  }
  return attrs;
}

/**
 *  Helper function to transform the input attributes map.
 *
 *  @private {function} attrs
 *  @param {Object} attrs the DOM attributes map.
 *
 *  @return mutated attributes object.
 */
function attributes(attrs) {
  let o = {}, k;
  for(k in attrs) {
    //if(/^on/.test(k)) {
      //console.error('got on attr');
    //}else{
      o[k] = attrs[k];
      key(k, attrs[k], o); 
      skip(k, attrs[k], o); 
      statics(k, attrs[k], o); 
    //}
  }
  return o;
}

/**
 *  Wraps the function body in a function declaration with a single `elem` 
 *  arguments.
 *
 *  @private {function} getFunctionDeclaration
 *  @param {Object} t the babel types object.
 *  @param {Array} body list of function body expressions.
 *  @param {String=render} name the function name.
 *  @param {String=elem} name the function argument.
 *
 *  @returns a function declaration.
 */
function getFunctionDeclaration(t, body, opts) {
  return t.functionDeclaration(
    t.identifier(opts.name), [t.identifier(opts.arg)], t.blockStatement(body));
}

/**
 *  Convert a single DOM `<template>` element to an AST program representing 
 *  the contents for a render function body.
 *
 *  @public {function} render
 *  @param {Object} el the element DOM.
 *  @param {Object} opts processing options.
 *  @param {String} prefix identifier prefix.
 *
 *  @returns {Object} function body AST.
 */
function render(el, opts, prefix) {

  opts = options(opts);

  const $ = opts.vdom
    , babel = require('babel-core')
    , t = babel.types
    , body = [];

  function getTemplateLiteralExpression(val) {
    return babel.transform(
      '`' + val  + '`', opts.babel).ast.program.body[0].expression;
  }

  function attributeIterator(key, val) {
    if(key && /^on/.test(key)) {
      const ast = babel.transform(val, opts.babel).ast;
      t.assertExpressionStatement(ast.program.body[0]);
      return ast.program.body[0].expression;
    }else if(val === true || val === false) {
      return t.booleanLiteral(val);
    }else if(val === String(val)) {
      if(opts.literals.attribute && PATTERN.test(val)) {
        return getTemplateLiteralExpression(val);
      }else{
        return t.stringLiteral(val);
      }
    }
    return t.stringLiteral(val);
  }

  function convert(childNodes, body) {
    let i
      , args = []
      , expr
      , child
      , el
      , text;

    function inlineScript(expr) {
      body.push(expr); 
    }

    for(i = 0;i < childNodes.length;i++) {
      child = childNodes[i];
      el = $(child);

      //console.log('[%s] %s (%s)', child.type, child.tagName, el.text());
    
      if(opts.scripts && child.type === SCRIPT) {
        text = el.text();
        //console.error('inline script %s', el.text());
        opts.babel.plugins = [
          require('./html-plugin')(module.exports, opts, text)];
        let script = babel.transform(text, opts.babel);
        script.ast.program.body.forEach(inlineScript)
        continue;
      }else if(child.type === TAG
        || child.type === STYLE
        // run time script
        || (child.type === SCRIPT && !opts.scripts)) {
        args = [t.stringLiteral(child.name)];

        // push attributes into function call when not empty
        let attrs = child.attribs;
        if(!isEmpty(attrs)) {
          //let it = propertyString;

          // parse attribute value as template literal
          //if(opts.literals.attribute) {
            //it = propertyTemplate;
          //}

          attrs = attributes(attrs);

          args.push(getObjectExpression(t, attrs, attributeIterator));
        }

        // got some child nodes to process
        if(child.childNodes && child.childNodes.length) {
       
          // get function expression
          const block = [];

          convert(child.childNodes, block);

          // NOTE: no function arguments
          args.push(
            t.arrowFunctionExpression([], t.blockStatement(block))
          );
        }

        // call skate.vdom.element();
        expr = t.expressionStatement(
          getCallExpression(t, ELEMENT, args));

      // child text node
      }else{
        text = el.text();

        //console.log('text: %s', text);

        let arg
          //, script;

        // skip text nodes that are just whitespace
        // this prevents lots of calls with `vdom.text(" ");`
        if(opts.normalize && /^\s*$/.test(text)) {
          continue; 
        }

        // parsing as inline template script to be compiled
        if(opts.scripts
          && child.tagName
          && child.tagName.toLowerCase() === SCRIPT
          && el.attr('type') === undefined) {
          continue;
        }else{

          // support for template literals in text nodes
          if(opts.literals.text && PATTERN.test(text)) {
            //console.log('get literal %s', text);
            arg = getTemplateLiteralExpression(text);
          // treat as a string
          }else{
            arg = t.stringLiteral(text);
          }

          // call skate.vdom.text();
          args = [arg];
          expr = t.expressionStatement(
            getCallExpression(t, TEXT, args));
        }
      }

      if(expr) {
        body.push(expr);
      }
    }
  }

  convert(el.childNodes, body);

  const tpl = $(el);
  
  let id = tpl.attr(opts.attr);

  if(!id) {
    throw new Error(
      `template declared with no identifier (${opts.attr} attribute)`);
  }

  if(prefix) {
    id = prefix + id; 
  }

  return {
    element: el,
    attributes: tpl.attr(),
    id: id,
    name: tpl.get(0).tagName,
    body: t.program(body),
    render: t.program([getFunctionDeclaration(t, body, opts)])
  }
}

module.exports = {
  options: options,
  render: render,
  html: html,
  map: map,
  main: main,
  partial: partial
}
