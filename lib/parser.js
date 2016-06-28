const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const EOL = require('os').EOL;

/**
 *  Compile all inline and external stylesheets to a CSS string.
 *
 *  @private
 */
function styles(definition, result, cb) {
  const file = definition.file;
  const base = path.dirname(file);

  let css = []
    , $ = definition.dom;

  function done() {
    cb(null, css.join(EOL));
  }

  // inline styles
  const styles = $('style');

  // concatenate all inline styles together 
  styles.each((index, elem) => {
    css.push($(elem).text().trim());
  })

  // external stylesheets to include
  const stylesheets = $('link[rel="stylesheet"][href]').toArray();

  // no external stylesheets for this component
  if(!stylesheets.length) {
    return done();
  }

  // iterate external stylesheets
  function next() {
    const sheet = stylesheets.shift(); 
    if(!sheet) {
      return done(); 
    }
    
    const href = path.normalize(path.join(base, $(sheet).attr('href')));
    fs.readFile(href, (err, contents) => {
      if(err) {
        return cb(err); 
      } 

      css.push(contents.toString());
      next();
    })
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

    definition.dom = cheerio.load(definition.contents);

    styles(definition, result, (err, css) => {
      if(err) {
        return cb(err); 
      }
      result.stylesheet = css;
      next();
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
  const result = {};

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
