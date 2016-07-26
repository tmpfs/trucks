/**
 *  Compiles HTML `<template>` elements to render functions.
 *
 *  @public {function} skate
 *  @param {Object} state compiler state.
 *  @param {Object} conf plugin configuration object.
 */
function skate(state, conf) {

  conf.id = conf.id || {
    pattern: /\{\{id\}\}/gm
  }

  conf.babel = conf.babel || {};

  const options = state.options
      , compiler = require('./compiler')
      // configuration for id attribute replacement
      // which enables {{id}} to be replaced with the
      // <dom-module> element id
      , id = conf.id
      , replace = (id && id.pattern instanceof RegExp);

  // setup the output file
  let file = state.getFile(options.js)
    , filename;

  // list of components processed
  let components = []
    // list of compiled template render functions
    // used for the final map
    , templates = [];

  return {
    end: (tree, cb) => {

      const babel = require('babel-core')
        , hash = compiler.map(templates, conf)
        , entry = compiler.main(conf);

      let map
        , main;

      // get the template map
      map = babel.transformFromAst(hash, options.babel);

      // get the template main function
      main = babel.transformFromAst(entry, options.babel);

      file.prepend(main.code);
      file.prepend(map.code);

      cb();
    },
    File: (node, cb) => {
      filename = node.file;
      cb();
    },
    Script: (node, cb) => {

      // perform {{id}} replacement
      if(replace && node && node.contents === String(node.contents)) {
        node.contents = node.contents.replace(id.pattern, node.parent.id); 
      }
      file.append(node.contents);

      cb();
    },
    leave: (node, cb) => {
      if(node instanceof state.components.Component) {

        conf.babel.filename = filename;

        // pass in query selector for the compiler
        conf.vdom = node.template.vdom;

        let res = compiler.render(node.template.element, conf);
        templates.push(res);
        components.push(node); 
      }

      cb();
    }
  }
}

module.exports = skate;
