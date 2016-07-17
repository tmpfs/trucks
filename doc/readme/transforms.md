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

### Compilers

* [skate][] Compiles HTML template to render functions

### Preprocessors

* [stylus][] Preprocess style sources as stylus
* [less][] Preprocess style sources as less
* [sass][] Preprocess style sources sass 

### Utility

* [trim][] Trim whitespace from inline styles and scripts
