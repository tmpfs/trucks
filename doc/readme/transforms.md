## Transforms

Transforms are a different type of plugin that are executed when the entire component tree is available.

A transform plugin returns a map of visitor functions:

```javascript
function plugin(state, conf) {
  return {
    '*': function(node, cb) {
      cb(); 
    }
  }
}
```

Each key in the returned map is evaluated to determine whether the visitor function wants to see a particular node, the wildcard `*` matches all nodes. Available node types are:

* `File` Visit component files.
* `Module` Visit component modules.
* `Component` Visit components.
* `Template` Visit HTML templates.
* `Style` Visit style elements.
* `Script` Visit script elements.

There are lifecycle keys that may be used:

* `begin`: Called before the tree is walked.
* `end`: Called when the tree walk is complete.

The `begin` and `end` functions are passed the component tree so the signature is always:

```javascript
function(node, cb);
```

To configure a transform plugin you can set a configuration object:

```javascript
const options = {
  files: ['components.html'],
  transforms: ['skate'],
  conf: {
    transforms: {
      skate: {/* plugin configuration goes here */}
    }
  }
};
```

### Compilers

* [skate][] Compiles HTML templates to render functions.

### Preprocessors

* [stylus][] Preprocess style sources as stylus.
* [less][] Preprocess style sources as less.
* [sass][] Preprocess style sources sass.

### Utility

* [trim][] Trim whitespace from inline styles and scripts.

