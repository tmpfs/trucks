const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const STYLE = 'style';
const LINK = 'link';

/**
 *  Compile all inline and external stylesheets to an array of CSS strings.
 *
 *  @private
 */
function styles(definition, result, el, cb) {
  const file = definition.file;
  const base = path.dirname(file);
  const $ = definition.dom;

  // inline style element
  if(el.name === STYLE) {
    result.css.push(
      {file: file, contents: $(el).text().trim(), inline: true});
    return cb();

  // external stylesheet reference
  }else if(el.name === LINK) {
    const href = path.normalize(path.join(base, $(el).attr('href')));
    fs.readFile(href, (err, contents) => {
      if(err) {
        return cb(err); 
      } 
      result.css.push({file: href, contents: contents.toString()});
      cb();
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

  // inline script element
  if(!src) {
    result.js.push(
      {file: file, contents: $(el).text().trim(), inline: true});
    return cb();

  // external script reference
  }else{
    const href = path.normalize(path.join(base, $(el).attr('src')));
    fs.readFile(href, (err, contents) => {
      if(err) {
        return cb(err); 
      } 
      result.js.push({file: href, contents: contents.toString()});
      cb();
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
 *  Iterate the components for a collection of components.
 *
 *  @private
 */
function component(collection, list, result, cb) {
  function next(err) {
    if(err) {
      return cb(err); 
    }
    const definition = list.shift();
    if(!definition) {
      return cb(); 
    }

    const $ = definition.dom = cheerio.load(definition.contents);

    // process styles first and maintain declaration order
    let elements = $('style, link[rel="stylesheet"][href]').toArray();

    iterator(definition, result, elements, styles, (err) => {
      if(err) {
        return cb(err); 
      }

      // process inline and external scripts
      elements = $('script').toArray();
      iterator(definition, result, elements, scripts, (err) => {
        if(err) {
          return cb(err); 
        }

        cb(null, result);

        // find component javascript definitions
        //defs(result, next);
      });
    })
  }

  next();
}

/**
 *  Parses the loaded file data to stylesheet and javascript strings.
 *
 *  @function parser
 *  @param {Object} contents The loaded file data.
 *  @param {Function} cb callback function.
 */
function parser(contents, cb) {
  const keys = Object.keys(contents);
  const result = {css: [], js: []};

  function next(err) {
    if(err) {
      return cb(err); 
    }

    const collection = keys.shift();
    if(!collection) {
      return cb(null, result); 
    }
    component(collection, contents[collection], result, next);
  }

  next();
}

module.exports = parser;
