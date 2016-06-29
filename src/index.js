const load = require('./load')
  , parse = require('./parse')
  , transform = require('./transform')
  , generate = require('./generate')
  , write = require('./write');

/**
 *  Compile component HTML files to CSS and Javascript.
 *
 *  @function trucks
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {Array} files list of HTML files to compile.
 *  @option {String} css path to write the generated stylesheet.
 *  @option {String} js path to write the generated javascript.
 *  @option {String} eol override the default EOL for concatenation.
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
          /* istanbul ignore next: generate does not currently error */
          if(err) {
            return cb(err); 
          }
          write(generated, opts, (err, written) => {
            if(err) {
              return cb(err); 
            }
            cb(null, written);
          });
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
 *  @param {Object} loaded The result from the load phase.
 *  @param {Object} [opts] processing options.
 *  @param {Function} cb callback function.
 */
trucks.parse = parse;

/**
 *  Transforms the parsed result compiling the html `<template>` element 
 *  corresponding to a javascript component definition to a function.
 *
 *  @function trucks.transform
 *  @param {Object} parsed The result from the parse phase.
 *  @param {Object} [opts] processing options.
 *  @param {Function} cb callback function.
 */
trucks.transform = transform;

/**
 *  Concatenates the transformed result to stylesheet and javascript strings.
 *
 *  @function trucks.generate
 *  @param {Object} transformed The result from the transform phase.
 *  @param {Object} [opts] processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {String} eol override the default EOL for concatenation.
 */
trucks.generate = generate;

/**
 *  Writes the generated result to stylesheet and javascript files.
 *
 *  @function trucks.write
 *  @param {Object} generated The result from the generate phase.
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {String} css path to write the generated stylesheet.
 *  @option {String} js path to write the generated javascript.
 */
trucks.write = write;

module.exports = trucks;
