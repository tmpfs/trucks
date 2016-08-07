## Plugins

---

- [Plugins](#plugins)
  - [Plugin Types](#plugin-types)
    - [Core Plugins](#core-plugins)
    - [Protocol Plugins](#protocol-plugins)
    - [Transform Plugins](#transform-plugins)
    - [Generator Plugins](#generator-plugins)
  - [Writing Plugins](#writing-plugins)
  - [Loading Plugins](#loading-plugins)
  - [Configuring Plugins](#configuring-plugins)

---

### Plugin Types

#### Core Plugins

Core plugins are bundled with the [trucks-compiler][] libary and run the main compiler phases:

* [load][] Read the HTML import tree.
* [parse][] Parse the `<dom-module>` elements.
* [transform][] Run tree transformations.
* [generate][] Create output file contents.
* [write][] Write output files to disc.

An additional plugin [sources][] reads the entire component tree by combining the [load][] and [parse][] plugins.

The [trucks-compiler][] library exposes constants for each of the core plugins so you can avoid string literals when modifying the plugins list:

```javascript
const trucks = require('trucks-compiler')
    , options = {
        files: ['components.html'],
        plugins: [trucks.LOAD, trucks.PARSE]
      };
```

Typically you should not need to modify the `plugins` list but it can be useful when you need a subset of the core compiler phases to be executed, for example to inspect the component tree without writing any files.

#### Protocol Plugins

Protocol plugins are initialized by the [load][] phase they are responsible for registering a protocol with a class that will resolve the URL to component files or an alternative compiler configuration. See the [http][resolver-http] plugin implementation.

#### Transform Plugins

Transform plugins are executed by the [transform][] phase when the entire component tree is ready. They should perform transformations on the component tree creating output files when needed. See the [csp][transform-csp] plugin implementation.

#### Generator Plugins

Generator plugins are executed by the [generate][] phase and may be used to create additional output files or perform extra processing after transformations have been applied. See the [page][generator-page] plugin implementation.

### Writing Plugins

Plugins are named functions that are passed the compiler state object and a configuration for the plugin and return a closure.

```javascript
function plugin(state, conf) {
  return function(state, cb) {
    cb(null, state); 
  }
}
```

Closures returned by the plugin functions are executed asynchronously (except protocol plugins which are synchronous) in series and may modify the state object.

Plugin functions may return an array of plugin functions which is useful to group related plugins, see the [sources][] plugin for an example.

### Loading Plugins

To load a particular plugin use the corresponding array option:

```javascript
const options = {
  files: ['components.html'],
  plugins: [trucks.LOAD]
};
```

Plugins may be functions (or an object with a `plugin` function) but typically are declared as strings.

When plugins are declared as strings and do not resolve to an absolute path they are treated as modules to require using a naming convention.

Core plugins use the `trucks-plugin` prefix so in the above example the package `trucks-plugin-load` will be loaded.

Protocol plugins use the `protocols` array and the `trucks-resolver` prefix. For example to load the `trucks-resolver-http` plugin:

```javascript
const options = {
  files: ['components.html'],
  protocols: ['http']
};
```

Transform plugins are defined in the `transforms` array and use the `trucks-transform` prefix. For example to load the `trucks-transform-csp` plugin:

```javascript
const options = {
  files: ['components.html'],
  transforms: ['csp']
};
```

Generator plugins are defined in the `generators` array and use the `trucks-generator` prefix. For example to load the `trucks-generator-page` plugin:

```javascript
const options = {
  files: ['components.html'],
  generators: ['page']
};
```

### Configuring Plugins

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

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on August 8, 2016

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
[examples]: https://github.com/tmpfs/trucks/blob/master/examples
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
[manual-standalone]: https://github.com/tmpfs/trucks/blob/master/manual/standalone.md
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

