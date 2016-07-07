const path = require('path')
    , fs = require('fs')
    , STYLE = 'style'
    , TEMPLATE = 'template'
    , RESERVED = [
        'annotation-xml',
        'color-profile',
        'font-face',
        'font-face-src',
        'font-face-uri',
        'font-face-format',
        'font-face-name',
        'missing-glyph'
      ];

/**
 *  Utility to validate a custom element name.
 *
 *  @private {function} validate
 *
 *  @see https://w3c.github.io/webcomponents/spec/custom/ \ 
 *    #custom-elements-core-concepts
 */
function validate(id) {
  if(~RESERVED.indexOf(id)) {
    throw new Error(`${id} is a reserved custom element name`); 
  }

  const re = new RegExp('(-|\\.|[0-9]|_|[a-z]|\\uB7'
      + '|[\\uC0-\\uD6]'
      + '|[\\uD8-\\uF6]'
      + '|[\\uF8-\\u37D]'
      + '|[\\u37F-\\u1FFF]'
      + '|[\\u200C-\\u200D]'
      + '|[\\u203F-\\u2040]'
      + '|[\\u2070-\\u218F]'
      + '|[\\u2C00-\\u2FEF]'
      + '|[\\u3001-\\uD7FF]'
      + '|[\\uF900-\\uFDCF]'
      + '|[\\uFDF0-\\uFFFFD]'
      + '|[\\u10000-\\uEFFFF]'
      + ')*')
    , ptn = new RegExp(
      '^[a-z]'
      + re.source
      + '-'
      + re.source
    );

  if(!ptn.test(id)) {
    throw new Error(`invalid custom element name ${id}`); 
  }
}

/**
 *  Utility to trim a result object contents removing leading and trailing 
 *  newlines.
 *
 *  @private {fuction} trim
 *  @param {Object} item the parsed item.
 *  @param {Object} options the trim options.
 */
function trim(item, options) {
  // only configured to trim inline content
  if(!options || (options.inline && !item.inline)) {
    return; 
  }

  // trim leading and trailing newlines
  if(options.newlines) {
    item.contents = item.contents.replace(/^\n+/, '');
    item.contents = item.contents.replace(/[\n ]+$/, '');
  }

  // trim every line
  if(options.lines && (options.pattern instanceof RegExp)) {
    let lines = item.contents.split('\n');
    lines = lines.map((line) => {
      return line.replace(options.pattern, ''); 
    })
    item.contents = lines.join('\n');
  }
}

/**
 *  Compile all inline and external stylesheets to an array of CSS strings.
 *
 *  @private
 */
function styles(definition, result, el, cb) {
  const file = definition.file
    , base = path.dirname(file)
    , $ = definition.dom
    , options = result.options;

  function done() {
    trim(result.css[result.css.length - 1], options.trim); 
    cb();
  }

  // inline style element
  if(el.name === STYLE) {
    result.css.push(
      {
        parent: definition.parent,
        file: file,
        contents: $(el).text(),
        inline: true
      });
    done();

  // external stylesheet reference
  }else{
    const href = path.normalize(path.join(base, $(el).attr('href')));
    fs.readFile(href, (err, contents) => {
      if(err) {
        return cb(err); 
      } 
      result.css.push({
        parent: definition.parent,
        file: href,
        contents: contents.toString()});
      done();
    })
  }
}

/**
 *  Compile all inline and external scripts to an array of Javascript strings.
 *
 *  @private
 */
function scripts(definition, result, el, cb) {
  const file = definition.file;
  const base = path.dirname(file);
  const $ = definition.dom;
  const src = $(el).attr('src');
  const options = result.options;

  function done() {
    trim(result.js[result.js.length - 1], options.trim); 
    cb();
  }

  // inline script element
  if(!src) {
    result.js.push(
      {
        parent: definition.parent,
        file: file,
        contents: $(el).text(),
        inline: true
      });
    return done();

  // external script reference
  }else{
    const href = path.normalize(path.join(base, $(el).attr('src')));
    fs.readFile(href, (err, contents) => {
      if(err) {
        return cb(err); 
      } 
      result.js.push({
        parent: definition.parent,
        file: href,
        contents: contents.toString()});
      done();
    })
  }
}

/**
 *  Compile all inline `<template>` elements an array of HTML strings.
 *
 *  @private
 */
function templates(definition, result, el, cb) {
  const file = definition.file;
  const base = path.dirname(file);
  const $ = definition.dom;
  const options = result.options;

  function done() {
    trim(result.tpl[result.tpl.length - 1], options.trim); 
    cb();
  }

  // inline template element
  if(el.name === TEMPLATE) {
    result.tpl.push(
      {
        parent: definition.parent,
        file: file,
        contents: $.html(el),
        inline: true
      });
    done();
  // external template reference
  }else{
    const href = path.normalize(path.join(base, $(el).attr('href')));
    fs.readFile(href, (err, contents) => {
      if(err) {
        return cb(err); 
      } 
      result.tpl.push({
        parent: definition.parent,
        file: href,
        contents: contents.toString()});
      done();
    })
  }
}

/**
 *  Iterate the elements returned by a DOM query.
 *
 *  @private
 */
function iterator(definition, result, elements, it, cb) {

  function next(err) {
    if(err) {
      return cb(err); 
    }

    const el = elements.shift();
    if(!el) {
      return cb(); 
    }

    it(definition, result, el, next);
  }

  next();
}

/**
 *  Iterate the templates, scripts and styles in a component module.
 *
 *  @private
 */
function component(mod, result, opts, cb) {
  const $ = mod.dom
    , context = mod.context;

  // process styles first and maintain declaration order
  let elements = $(opts.selectors.styles, context).toArray();
  iterator(mod, result, elements, styles, (err) => {
    if(err) {
      return cb(err); 
    }

    // process inline and external scripts
    elements = $(opts.selectors.scripts, context).toArray();
    iterator(mod, result, elements, scripts, (err) => {
      if(err) {
        return cb(err); 
      }

      // process inline and external template elements
      elements = $(opts.selectors.templates, context).toArray();

      if(elements.length > 1) {
        return cb(
          new Error(
            `only a single template element is allowed per dom-module`)); 
      }

      // proxy the dom-module id to the template
      $(elements[0]).attr('id', mod.id);

      iterator(mod, result, elements, templates, (err) => {
        if(err) {
          return cb(err); 
        }
        cb();
      });
    });
  })
}

/**
 *  Iterate `<dom-module>` elements.
 *
 *  @private {function} modules
 */
function modules(list, result, opts, cb) {
  const cheerio = require('cheerio');
 
  function next(err) {
    if(err) {
      return cb(err); 
    }
    const mod = list.shift(); 
    if(!mod) {
      return cb(null, result);
    }

    // parse all the <dom-module> elements
    const $ = mod.dom = cheerio.load(mod.contents)
      , elements = $(opts.selectors.modules).toArray();

    if(!elements.length) {
      return next(new Error(`no component modules in ${mod.file}`)); 
    }

    function it(err) {
      if(err) {
        return next(err); 
      }
      const context = elements.shift(); 
      if(!context) {
        return next(); 
      }

      const id = $(context).attr('id');

      if(!id) {
        return next(
          new Error(
            `identifier missing for component module in ${mod.file}`)); 
      }

      // validate custom element name as per the spec
      try {
        validate(id);
      }catch(e) {
        return next(e); 
      }

      mod.id = id;
      mod.context = context;
      component(mod, result, opts, it);
    }

    it();
  }

  next();
}

/**
 *  @private
 */
function parse(list, opts, cb) {

  // NOTE: not currently any options for the parse
  // NOTE: phase but use consistent function signature
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts = opts || {};

  const result = {css: [], js: [], tpl: [], options: opts};
  modules(list, result, opts, cb);
}

module.exports = parse;
