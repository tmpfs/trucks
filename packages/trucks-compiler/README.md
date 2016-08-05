# Trucks Compiler

> Web component compiler and package manager

Compiles web components declared as HTML to separate Javascript, CSS and HTML files.

## Install

```
npm i trucks-compiler --save-dev
```

---

- [Install](#install)
- [Usage](#usage)
- [Plugins](#plugins)
- [Options](#options)
- [API](#api)
  - [trucks](#trucks)
  - [CompilerState](#compilerstate)
  - [OutputFile](#outputfile)
  - [Registry](#registry)
  - [Registry](#registry-1)
  - [ComponentTree < ComponentImport](#componenttree-componentimport)
  - [ComponentFile < ComponentImport](#componentfile-componentimport)
  - [ComponentModule < ComponentNode](#componentmodule-componentnode)
  - [ComponentTemplate < ComponentTrait](#componenttemplate-componenttrait)
  - [ComponentStyle < ComponentTrait](#componentstyle-componenttrait)
  - [ComponentScript < ComponentTrait](#componentscript-componenttrait)
  - [Component < ComponentNode](#component-componentnode)
- [Documents](#documents)
- [License](#license)

---

## Usage

```javascript
const trucks = require('trucks-compiler');

trucks(
  {
    files: ['components.html'],
    transforms: ['skate'],
    out: 'target',
    force: true
  },
  (err, state) => {
    if(err) {
      throw err; 
    }
    console.log(state);
  }
);
```

## Plugins

Plugins execute the main compiler phases that are bundled with the core libary:

* [load][] Read the HTML import tree
* [parse][] Parse the `<dom-module>` elements
* [transform][] Run tree transformations
* [generate][] Create output file contents
* [write][] Write output files to disc

An additional plugin [sources][] reads the entire component tree by combining the [load][] and [parse][] plugins.

Plugins are named functions that are passed the compiler state object and a configuration for the plugin and return a closure.

```javascript
function plugin(state, conf) {
  return function(state, cb) {
    cb(null, state); 
  }
}
```

Closures returned by the plugin functions are executed asynchronously in series and may modify the state object.

The `state` object contains several useful fields but most noteworthy are:

* `options` Reference to the computed options
* `tree` Component tree populated by the [load][] and [parse][] plugins

You may configure the plugins used for low-level access. For example if you just wanted to print the HTML import tree:

```javascript
const options = {
  files: ['components.html'],
  plugins: [trucks.LOAD /* add custom tree plugin */]
};
```

To configure a plugin you can set a configuration object using the plugin id:

```javascript
const options = {
  files: ['components.html'],
  plugins: [trucks.LOAD],
  conf: {
    plugins: {
      load: {/* plugin configuration goes here */}
    }
  }
};
```

By default the plugin id is the name of the function but it may be changed by assigning an `id`:

```javascript
function plugin(state, conf) {
  return function(state, cb) {
    cb(); 
  }
}
plugin.id = 'custom-plugin';
module.exports = plugin;
```

To configure such a plugin use:

```javascript
const options = {
  conf: {
    plugins: {
      'custom-plugin': {/* plugin configuration goes here */}
    }
  }
};
```

## Options

This document shows the default options used when none are provided.

```javascript
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
```

## API

### trucks

```javascript
trucks(opts, cb)
```

Compile component files to CSS, Javascript and HTML.

Returns compiler state.

* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `files` Array list of HTML files to compile.
* `out` String output directory for files.
* `force` Boolean overwrite files that already exist.
* `name` String=components name of the output files.
* `rc` Array|String configuration files to load as options.
* `babel` Object options to pass to babel transform.
* `conf` Object configuration for plugins and transforms.
* `before` Object before hooks for plugins and transforms.
* `after` Object after hooks for plugins and transforms.
* `html` String path to write the generated template markup.
* `css` String path to write the generated stylesheet.
* `js` String path to write the generated javascript.
* `eol` String override the default EOL for concatenation.

### CompilerState

Encapsulates the state of the compiler plugin execution.

#### CompilerState

```javascript
public CompilerState(options, compiler)
```

Creates a compiler state.

* `options` Object computed options.
* `compiler` Function reference to the main compiler entry point.

### OutputFile

Represents an output file that will be written to disc when the
write plugin is executed.

To get an instance of this class call `state.getFile()`.

#### OutputFile

```javascript
public OutputFile(file, name, base, options)
```

Creates an output file.

* `file` String path to the file.
* `name` String relative path for the file.
* `base` String base path for the file.
* `options` Object computed options.

#### prepend

```javascript
prepend(buf)
```

Prepend data to this output file.

* `buf` String contents to prepend to the file.

#### append

```javascript
append(buf)
```

Append data to this output file.

* `buf` String contents to append to the file.

#### contents

```javascript
Array contents
```

list of file contents.

#### getFileContents

```javascript
public getFileContents()
```

Get the computed contents for the output file.

Should be called once just prior to writing the file to disc.

Returns string file contents.

### Registry

Registry for a mapping between protocol schemes and resolver classes.

### Registry

Create a new scheme registry.

#### setDefault

```javascript
public setDefault(val)
```

Set the default scheme resolver.

* `val` Function resolver class.

#### getDefault

```javascript
public getDefault()
```

Get the default scheme resolver.

Will be `null` if no plugins have registered a default handler by calling
the `setDefault` method.

Returns a default resolver class.

#### getResolver

```javascript
public getResolver(scheme)
```

Get the resolver class for a given scheme.

If the scheme is invalid (false) then a default scheme is returned, if no
default scheme has been registered the return value is `null`.

If a resolver is not declared for the scheme returns `undefined`.

Returns a resolver class for the scheme.

* `scheme` String protocol scheme.

#### register

```javascript
public register(scheme, resolver)
```

Register a resolver class for a scheme.

Scheme names should include a trailing colon.

* `scheme` String protocol scheme.
* `resolver` Function constructor function.

#### factory

```javascript
public factory(state, href, parent)
```

Create a new resolver for an `href`.

* `state` Object compiler state.
* `href` String the URL to resolve.
* `parent` Object a parent resolver instance.

### ComponentTree < ComponentImport

Represents the root of a component hierarchy.

### ComponentFile < ComponentImport

Represents a file in the component tree.

#### ComponentFile

```javascript
public ComponentFile(file, contents, parent)
```

Creates a component file node.

* `file` String path to the file.
* `contents` String file contents.
* `parent` Object file owner.

### ComponentModule < ComponentNode

Represents a module defined by a `<dom-module>` element.

#### ComponentModule

```javascript
public ComponentModule(id, parent)
```

Creates a component module node.

* `id` String module identifier.
* `parent` Object module owner.

### ComponentTemplate < ComponentTrait

Represents a template defined by a `<template>` or `<link>` element.

### ComponentStyle < ComponentTrait

Represents a style defined by a `<style>` or `<link>` element.

### ComponentScript < ComponentTrait

Represents a script defined by a `<script>` element.

### Component < ComponentNode

Represents a component node with a main template, list of
template partials and component local styles.

#### Component

```javascript
public Component(template, parent)
```

Creates a component node.

* `template` Object primary template for the component.
* `parent` Object component owner (module).

## Documents

For insights into the compiler phases and data structures see [COMPILER](https://github.com/tmpfs/trucks/blob/master/packages/trucks-compiler/doc/COMPILER.md).

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on August 5, 2016

[skatejs]: https://github.com/skatejs/skatejs
[webcomponents]: https://github.com/w3c/webcomponents
[shadow-dom]: https://w3c.github.io/webcomponents/spec/shadow/
[custom-elements]: https://www.w3.org/TR/custom-elements/
[html-imports]: https://w3c.github.io/webcomponents/spec/imports/
[html-templates]: https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
[polymer]: https://www.polymer-project.org/1.0/
[react]: https://facebook.github.io/react/
[react-webcomponents]: https://github.com/facebook/react/issues/5052
[react-integration]: https://github.com/skatejs/react-integration
[mozilla-webcomponents]: https://hacks.mozilla.org/2014/12/mozilla-and-web-components/
[csp]: http://content-security-policy.com/
[npm]: https://www.npmjs.com/
[postcss]: https://github.com/postcss/postcss
[mkdoc]: https://github.com/mkdoc/mkdoc
[mkapi]: https://github.com/mkdoc/mkapi
[mkparse]: https://github.com/mkdoc/mkparse
[jshint]: http://jshint.com
[jscs]: http://jscs.info
[manual]: https://github.com/tmpfs/trucks/blob/master/manual
[trucks]: https://github.com/tmpfs/trucks
[trucks-cli]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli
[trucks-compiler]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-compiler
[sources]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-sources
[load]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-load
[parse]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-parse
[transform]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-transform
[generate]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-generate
[write]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-write
[transform-csp]: https://github.com/tmpfs/trucks/blob/master/packages/transform-csp
[bundle]: https://github.com/tmpfs/trucks/blob/master/packages/transform-bundle
[copy]: https://github.com/tmpfs/trucks/blob/master/packages/transform-copy
[skate]: https://github.com/tmpfs/trucks/blob/master/packages/transform-skate
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[tree]: https://github.com/tmpfs/trucks/blob/master/packages/transform-tree
[usage]: https://github.com/tmpfs/trucks/blob/master/packages/transform-usage
[style-extract]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-extract
[style-inject]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-inject
[resolver-core]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-core
[resolver-file]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-file
[resolver-http]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-http
[resolver-npm]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-npm
[generator-page]: https://github.com/tmpfs/trucks/blob/master/packages/generator-page
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

