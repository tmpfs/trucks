## Compiler

The compiler executes the following plugins:

* [load][] Load all source HTML files given with the `files` option and resolve the HTML imports.
* [parse][] Parse the imported files resolving styles, javascript and template elements.
* [transform][] Transform the component tree.
* [generate][] Convert the transformed components to css and javascript strings.
* [write][] Write the generated styles and javascript to files.

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
ComponentFile {
  imports: 
   [ ComponentFile {
       imports: [Object],
       file: '/home/muji/git/trucks/doc/compiler/x-button.html',
       contents: '<link rel="import" href="x-icon.html">\n\n<dom-module id="x-button">\n  <template></template>\n\n  <style>\n    x-button {\n      /* component styles */\n    }\n  </style>\n\n  <script>\n    skate.define(\'{{id}}\', {});\n  </script>\n</dom-module>\n',
       parent: [Circular],
       modules: [],
       duplicates: [],
       querySelectorAll: [Object],
       href: 'x-button.html' } ],
  file: '/home/muji/git/trucks/doc/compiler/components.html',
  contents: '<link rel="import" href="x-button.html">\n',
  parent: null,
  modules: [],
  duplicates: [],
  querySelectorAll: 
   { [Function]
     fn: { constructor: [Circular], _originalRoot: [Object] },
     load: [Function],
     html: [Function],
     xml: [Function],
     text: [Function],
     parseHTML: [Function],
     root: [Function],
     contains: [Function],
     _root: 
      { type: 'root',
        name: 'root',
        attribs: {},
        children: [Object],
        next: null,
        prev: null,
        parent: null },
     _options: 
      { withDomLvl1: true,
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: true } },
  href: 'doc/compiler/components.html' }
```

Imported component file paths are resolved relative to the declaring file.

### Parse

The parse phase takes the output from the load phase and extracts the css, javascript and template elements:

```javascript
ComponentModule {
  id: 'x-button',
  parent: 
   ComponentFile {
     imports: [ [Object] ],
     file: '/home/muji/git/trucks/doc/compiler/x-button.html',
     contents: '<link rel="import" href="x-icon.html">\n\n<dom-module id="x-button">\n  <template></template>\n\n  <style>\n    x-button {\n      /* component styles */\n    }\n  </style>\n\n  <script>\n    skate.define(\'{{id}}\', {});\n  </script>\n</dom-module>\n',
     parent: 
      ComponentFile {
        imports: [Object],
        file: '/home/muji/git/trucks/doc/compiler/components.html',
        contents: '<link rel="import" href="x-button.html">\n',
        parent: null,
        modules: [],
        duplicates: [],
        querySelectorAll: [Object],
        href: 'doc/compiler/components.html' },
     modules: [ [Circular] ],
     duplicates: [],
     querySelectorAll: 
      { [Function]
        fn: [Object],
        load: [Function],
        html: [Function],
        xml: [Function],
        text: [Function],
        parseHTML: [Function],
        root: [Function],
        contains: [Function],
        _root: [Object],
        _options: [Object] },
     href: 'x-button.html' },
  component: 
   Component {
     template: 
      ComponentTemplate {
        element: [Object],
        contents: '<template id="x-button"></template>',
        parent: [Circular],
        href: undefined,
        file: undefined,
        id: 'x-button',
        querySelectorAll: [Object] },
     parent: [Circular],
     partials: [],
     styles: [] },
  templates: 
   [ ComponentTemplate {
       element: [Object],
       contents: '<template id="x-button"></template>',
       parent: [Circular],
       href: undefined,
       file: undefined,
       id: 'x-button',
       querySelectorAll: [Object] } ],
  stylesheets: 
   [ ComponentStyle {
       element: [Object],
       contents: '\n    x-button {\n      /* component styles */\n    }\n  ',
       parent: [Circular],
       href: undefined,
       file: undefined,
       querySelectorAll: [Object] } ],
  styles: 
   [ ComponentStyle {
       element: [Object],
       contents: '\n    x-button {\n      /* component styles */\n    }\n  ',
       parent: [Circular],
       href: undefined,
       file: undefined,
       querySelectorAll: [Object] } ],
  scripts: 
   [ ComponentScript {
       element: [Object],
       contents: '\n    skate.define(\'{{id}}\', {});\n  ',
       parent: [Circular],
       href: undefined,
       file: undefined,
       querySelectorAll: [Object] } ],
  querySelectorAll: 
   { [Function]
     fn: { constructor: [Circular], _originalRoot: [Object] },
     load: [Function],
     html: [Function],
     xml: [Function],
     text: [Function],
     parseHTML: [Function],
     root: [Function],
     contains: [Function],
     _root: 
      { type: 'root',
        name: 'root',
        attribs: {},
        children: [Object],
        next: null,
        prev: null,
        parent: null },
     _options: 
      { withDomLvl1: true,
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: true } } }
```

### Transform

The transform phase takes the parsed result and compiles the `<template>` elements to javascript functions that can be called from the component `render()` function.

```javascript
{ '/home/muji/git/trucks/target/components.js': 
   OutputFile {
     eol: '\n\n',
     file: '/home/muji/git/trucks/target/components.js',
     name: 'target/components.js',
     base: undefined,
     _contents: 
      [ 'const templates = {\n  "x-icon": function render(elem) {},\n  "x-button": function render(elem) {}\n};',
        'function template(elem) {\n  return templates[elem.tagName.toLowerCase()].call(elem, elem);\n}',
        '\n    skate.define(\'x-icon\', {});\n  ',
        '\n    skate.define(\'x-button\', {});\n  ' ] } }
```

### Generate

After transformation the generate phase will concatenate all the css and transformed javascript code.

```javascript
{ '/home/muji/git/trucks/target/components.js': 
   OutputFile {
     eol: '\n\n',
     file: '/home/muji/git/trucks/target/components.js',
     name: 'target/components.js',
     base: undefined,
     _contents: 
      [ 'const templates = {\n  "x-icon": function render(elem) {},\n  "x-button": function render(elem) {}\n};',
        'function template(elem) {\n  return templates[elem.tagName.toLowerCase()].call(elem, elem);\n}',
        '\n    skate.define(\'x-icon\', {});\n  ',
        '\n    skate.define(\'x-button\', {});\n  ' ] },
  '/home/muji/git/trucks/target/components.css': 
   OutputFile {
     eol: '\n\n',
     file: '/home/muji/git/trucks/target/components.css',
     name: 'target/components.css',
     base: undefined,
     _contents: 
      [ '\n    x-icon {\n      /* component styles */\n    }\n  ',
        '\n    x-button {\n      /* component styles */\n    }\n  ' ] } }
```

### Write

The final phase writes the generated files to disc.

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 17, 2016

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
[skate]: https://github.com/tmpfs/trucks/blob/master/packages/transform-skate
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass

