const options = {
  // array list of component source files
  files: null,
  // array list of configuration files to load and merge
  rc: undefined,
  // array list of plugins to execute
  plugins: undefined,
  // array list of transform plugins to run
  transforms: undefined,
  // map of plugin configuration objects
  conf: {
    plugins: {},
    transforms: {}
  },
  // options to pass to babel
  babel: {},
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
  // override the default operating system EOL for file concatenation
  eol: undefined,
  // behaviour for trimming whitespace
  trim: {
    // only trim inline content
    inline: true,
    // trim leading and trailing newlines
    newlines: true,
    // pattern used to trim lines, default is two spaces or a tab
    // repeated twice at the beginning of each line
    pattern: /^(  |\t){2,2}/,
    // trim lines using pattern
    lines: true
  }
}

module.exports = options;
