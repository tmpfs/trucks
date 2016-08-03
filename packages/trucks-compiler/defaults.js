const options = {
  // array list of component source files
  files: null,
  // base path for relative paths (default: cwd)
  base: undefined,
  // output directory
  out: undefined,
  // name of output files (does not include a file extension)
  name: 'components',
  // set or override the file path for the HTML output
  html: undefined,
  // set or override the file path for the CSS output
  css: undefined,
  // set or override the file path for the Javascript output
  js: undefined,
  // force overwrite files if they already exist
  force: false,
  // options to pass to babel
  babel: {},
  // override the default operating system EOL for file concatenation
  eol: undefined,
  // array list of configuration files to load and merge
  rc: undefined,
  // array list of plugins to execute
  plugins: undefined,
  // array list of transform plugins to run
  transforms: undefined,
  // array list of protocol resolvers
  protocols: undefined,
  // map of plugin configuration objects
  conf: {
    // configuration for compiler plugins
    plugins: {},
    // configuration for transform plugins
    transforms: {},
    // configuration for protocol resolvers
    protocols: {}
  },
  before: {
    // array list to run before plugins or transforms
    plugins: undefined, 
    transforms: undefined
  },
  after: {
    // array list to run after plugins or transforms
    plugins: undefined, 
    transforms: undefined
  },
  // map of component identifiers to stylesheets
  // used by the `style-extract` and `style-inject` transforms
  // non-absolute paths are resolved relative to the output directory
  stylesheets: undefined
}

module.exports = options;
