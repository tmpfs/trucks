## Options

This document shows the default options used when none are provided.

---

- [Options](#options)

---

```javascript
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
  eol: undefined
}

module.exports = options;
```

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 18, 2016

