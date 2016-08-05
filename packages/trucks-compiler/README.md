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
- [Documents](#documents)
- [License](#license)

---

## Usage

Programmatic usage:

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

## Documents

Some background on motivation and rationale is in the [INTRO](https://github.com/tmpfs/trucks/blob/master/packages/trucks-compiler/doc/INTRO.md).

For the API docs see [API](https://github.com/tmpfs/trucks/blob/master/doc/API.md), an overview of the available options is in [OPTIONS](https://github.com/tmpfs/trucks/blob/master/packages/trucks-compiler/doc/OPTIONS.md). For insights into the compiler phases and data structures see [COMPILER](https://github.com/tmpfs/trucks/blob/master/packages/trucks-compiler/doc/COMPILER.md).

Information on how to build this project is in [DEVELOPER](https://github.com/tmpfs/trucks/blob/master/packages/trucks-compiler/doc/DEVELOPER.md).

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on August 5, 2016

[trucks]: https://github.com/tmpfs/trucks
[trucks-cli]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli
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
[style-extract]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-extract
[style-inject]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-inject
[resolver-core]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-core
[resolver-file]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-file
[resolver-http]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-http
[resolver-npm]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-npm
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

