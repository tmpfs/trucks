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

// NOTE: this function is documented in src/compile.js
trucks.compile = function(html, opts) {
  // NOTE: lazy require for compiler code
  const compiler = require('./compile');
  return compiler(html, opts);
}

plugins.phases.forEach((phase) => {
  trucks[phase.toUpperCase()] = phase;
})

module.exports = trucks;
