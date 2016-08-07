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

Typically you should not need to modify the `plugins` list but it can be useful when you need a subset of the core compiler phases to be executed, for example if you wanted to inspect the component tree without writing any files.

#### Protocol Plugins

Protocol plugins are initialized by the [load][] phase (see the [file][resolver-file] plugin) they are responsible for registering a protocol (eg: `file:`) with a class that will resolve the URL to component files or an alternative compiler configuration.

#### Transform Plugins

Transform plugins are executed by the [transform][] phase (see the [csp][transform-csp] plugin) when the entire component tree is ready. They should perform transformations on the component tree creating output files when needed.

#### Generator Plugins

Generator plugins are executed by the [generator][] phase (see the [page][generator-page] plugin) and may be used to create additional output files or perform extra processing after transformations have been applied.

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
  plugins: ['load']
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

