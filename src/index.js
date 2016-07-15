const plugins = require('./plugins');

/**
 *  Compile component files to CSS, Javascript and HTML.
 *
 *  @function trucks
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {Array} files list of HTML files to compile.
 *  @option {Array|String} [conf] configuration files to load as options.
 *  @option {Object} [babel] options to pass to babel transform.
 *  @option {Object} [compiler] options to pass to the compiler.
 *  @option {Boolean=false} [extract] do not compile templates, write to file.
 *  @option {Object} [trim] configure whitespace trim options.
 *  @option {String} [out] output directory for files.
 *  @option {String=components} [name] name of the output files.
 *  @option {String} [html] path to write the generated template markup.
 *  @option {String} [css] path to write the generated stylesheet.
 *  @option {String} [js] path to write the generated javascript.
 *  @option {Boolean} [force] overwrite files that already exist.
 *  @option {String} [eol] override the default EOL for concatenation.
 */
function trucks(opts, cb) {
  // run the plugins using the supplied options
  // which will be converted to a compiler state
  return plugins(opts, cb);
}

/**
 *  Parses the loaded file data to stylesheet and javascript strings.
 *
 *  @function trucks.parse
 *  @param {Object} loaded The result from the load phase.
 *  @param {Object} [opts] processing options.
 *  @param {Function} cb callback function.
 */
trucks.parse = function() {
  return require('./parse').apply(this, arguments);
}

/**
 *  Transforms the parsed result compiling the html `<template>` element 
 *  corresponding to a javascript component definition to a function.
 *
 *  @function trucks.transform
 *  @param {Object} parsed The result from the parse phase.
 *  @param {Object} [opts] processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {Object} babel options to pass to babel transform.
 */
trucks.transform = function() {
  return require('./transform').apply(this, arguments);
}

// NOTE: this function is documented in src/compile.js
trucks.compile = function(html, opts) {
  // NOTE: lazy require for compiler code
  const compiler = require('./compile');
  return compiler(html, opts);
}

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
trucks.generate = function() {
  return require('./generate').apply(this, arguments);
}

/**
 *  Writes the generated result to stylesheet and javascript files.
 *
 *  If the `out` option is given then all files are written to the target 
 *  directory using the `name` option, file extensions are added automatically.
 *
 *  When the `html`, `css` and `js` options are given they override any paths 
 *  built using the `out` and `name` options.
 *
 *  @function trucks.write
 *  @param {Object} generated The result from the generate phase.
 *  @param {Object} opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {String} out output directory for files.
 *  @option {String=components} name name of the output files.
 *  @option {String} html path to write the generated template markup.
 *  @option {String} css path to write the generated stylesheet.
 *  @option {String} js path to write the generated javascript.
 *  @option {Boolean} force overwrite files that already exist.
 */
trucks.write = function() {
  return require('./write').apply(this, arguments);
}

plugins.phases.forEach((phase) => {
  trucks[phase.toUpperCase()] = phase;
})

module.exports = trucks;
