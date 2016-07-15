## Compiler

The compiler executes the following phases:

* `load`: Load all source HTML files given with the `files` option and resolve the HTML imports.
* `parse`: Parse the imported files resolving styles, javascript and template elements.
* `transform`: Transform the imported component files compiling `<template>` elements to javascript.
* `generate`: Convert the transformed components to css and javascript strings.
* `write`: Write the generated styles and javascript to files.

---

- [Compiler](#compiler)
  - [Load](#load)
  - [Parse](#parse)
  - [Transform](#transform)
  - [Generate](#generate)
  - [Write](#write)

---

### Load

Given a components file [components.html](https://github.com/tmpfs/trucks/blob/master/doc/compiler/components.html) such as:

```html
<link rel="import" href="x-button.html">
```

The load phase will build the result object:

```javascript
ComponentTree {
  imports: 
   [ ComponentFile {
       file: '/home/muji/git/trucks/doc/compiler/components.html',
       contents: '<link rel="import" href="x-button.html">\n',
       parent: null,
       imports: [Object],
       modules: [],
       duplicates: [],
       querySelectorAll: [Object],
       href: 'doc/compiler/components.html' } ] }
```

Imported component file paths are resolved relative to the declaring file.

### Parse

The parse phase takes the output from the load phase and extracts the css, javascript and template elements:

```javascript
ComponentTree {
  imports: 
   [ ComponentFile {
       file: '/home/muji/git/trucks/doc/compiler/components.html',
       contents: '<link rel="import" href="x-button.html">\n',
       parent: null,
       imports: [Object],
       modules: [],
       duplicates: [],
       querySelectorAll: [Object],
       href: 'doc/compiler/components.html' } ] }
```

### Transform

The transform phase takes the parsed result and compiles the `<template>` elements to javascript functions that can be called from the component `render()` function.

```javascript
ComponentTree {
  imports: 
   [ ComponentFile {
       file: '/home/muji/git/trucks/doc/compiler/components.html',
       contents: '<link rel="import" href="x-button.html">\n',
       parent: null,
       imports: [Object],
       modules: [],
       duplicates: [],
       querySelectorAll: [Object],
       href: 'doc/compiler/components.html' } ] }
```

Note that some data has been omitted from the example output for brevity.

### Generate

After transformation the generate phase will concatenate all the css and transformed javascript code.

```javascript
{}
```

Note that some data has been omitted from the example output for brevity.

### Write

The final phase writes the generated files to disc.

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 15, 2016

