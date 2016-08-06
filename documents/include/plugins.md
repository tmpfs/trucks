### Plugin Types

Plugins are grouped into different types:

* Core plugins are executed by the compiler (see the [load][] plugin).
* Protocol plugins are initialized by the [load][] phase  (see the [file][resolver-file] plugin).
* Transform plugins are executed by the [transform][] phase (see the [csp][transform-csp] plugin).
* Generator plugins are executed by the [generator][] phase (see the [page][generator-page] plugin).

### Core Plugins

Core plugins are bundled with the [trucks-compiler][] libary and run the main compiler phases:

* [load][] Read the HTML import tree
* [parse][] Parse the `<dom-module>` elements
* [transform][] Run tree transformations
* [generate][] Create output file contents
* [write][] Write output files to disc

An additional plugin [sources][] reads the entire component tree by combining the [load][] and [parse][] plugins.

### Writing Plugins

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

