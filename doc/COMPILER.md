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
<link rel="import" href="x-icon.html">
<link rel="import" href="x-button.html">
```

The load phase will build the result object:

```json
{
  "files": [
    {
      "file": "doc/compiler/x-button.html",
      "parent": "doc/compiler/components.html",
      "contents": "<dom-module id=\"x-button\">\n  <template></template>\n\n  <style>\n    x-button {\n      /* component styles */\n    }\n  </style>\n\n  <script>\n    skate.define('{{id}}', {});\n  </script>\n</dom-module>\n"
    },
    {
      "file": "doc/compiler/x-icon.html",
      "parent": "doc/compiler/components.html",
      "contents": "<dom-module id=\"x-icon\">\n  <template>\n  </template>\n\n  <style>\n    x-icon {\n      /* component styles */\n    }\n  </style>\n\n  <script>\n    skate.define('{{id}}', {});\n  </script>\n</dom-module>\n"
    }
  ]
}
```

Imported component file paths are resolved relative to the declaring file.

### Parse

The parse phase takes the output from the load phase and extracts the css, javascript and template elements:

```json
{
  "css": [
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-button.html",
      "contents": "x-button {\n  /* component styles */\n}",
      "inline": true
    },
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-icon.html",
      "contents": "x-icon {\n  /* component styles */\n}",
      "inline": true
    }
  ],
  "js": [
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-button.html",
      "contents": "skate.define('x-button', {});",
      "inline": true
    },
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-icon.html",
      "contents": "skate.define('x-icon', {});",
      "inline": true
    }
  ],
  "tpl": [
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-button.html",
      "contents": "<template id=\"x-button\"></template>",
      "inline": true
    },
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-icon.html",
      "contents": "<template id=\"x-icon\">\n  </template>",
      "inline": true
    }
  ]
}
```

### Transform

The transform phase takes the parsed result and compiles the `<template>` elements to javascript functions that can be called from the component `render()` function.

```json
{
  "js": [
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-button.html",
      "contents": "skate.define('x-button', {});",
      "inline": true,
      "code": "skate.define('x-button', {});"
    },
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-icon.html",
      "contents": "skate.define('x-icon', {});",
      "inline": true,
      "code": "skate.define('x-icon', {});"
    }
  ]
}
```

Note that some data has been omitted from the example output for brevity.

### Generate

After transformation the generate phase will concatenate all the css and transformed javascript code.

```json
{
  "stylesheet": "x-button {\n  /* component styles */\n}\n\nx-icon {\n  /* component styles */\n}",
  "javascript": "const templates = {\n  \"x-button\": function render(elem) {},\n  \"x-icon\": function render(elem) {}\n};\n\nfunction template(elem) {\n  return templates[elem.tagName.toLowerCase()].call(elem, elem);\n}\n\nskate.define('x-button', {});\n\nskate.define('x-icon', {});"
}
```

Note that some data has been omitted from the example output for brevity.

### Write

The final phase writes the generated files to disc.

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 10, 2016

