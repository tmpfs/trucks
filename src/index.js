const load = require('./load')
  , parse = require('./parse')
  , transform = require('./transform')
  , generate = require('./generate');

/**
 *  Compile component HTML files to CSS and Javascript.
 *
 *  @function trucks
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {Array} files list of HTML files to compile.
 */
function trucks(opts, cb) {
  opts = opts || {};

  load(opts, (err, loaded) => {
    if(err) {
      return cb(err); 
    } 
    parse(loaded, opts, (err, parsed) => {
      if(err) {
        return cb(err); 
      }
      transform(parsed, opts, (err, transformed) => {
        if(err) {
          return cb(err); 
        }
        generate(transformed, opts, (err, generated) => {
          if(err) {
            return cb(err); 
          }

          cb(null, generated);
        });
      });
    });
  })
}

/**
 *  Read the component definition file contents.
 *
 *  @function trucks.load
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {Array} files list of HTML files to compile.
 */
trucks.load = load;

/**
 *  Parses the loaded file data to stylesheet and javascript strings.
 *
 *  @function trucks.parse
 *  @param {Object} result The result from the load compiler phase.
 *  @param {Object} [opts] processing options.
 *  @param {Function} cb callback function.
 */
trucks.parse = parse;

/**
 *  Transforms the parsed result compiling the html `<template>` element 
 *  corresponding to a javascript component definition to a function.
 *
 *  @function trucks.transform
 *  @param {Object} result The result from the parse compiler phase.
 *  @param {Object} [opts] processing options.
 *  @param {Function} cb callback function.
 */
trucks.transform = transform;

/**
 *  Concatenates the transformed result to stylesheet and javascript strings.
 *
 *  @function trucks.generate
 *  @param {Object} result The result from the transform compiler phase.
 *  @param {Object} [opts] processing options.
 *  @param {Function} cb callback function.
 */
trucks.generate = generate;

module.exports = trucks;
