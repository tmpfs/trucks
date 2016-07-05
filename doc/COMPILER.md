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
[
  {
    "file": "doc/compiler/x-button.html",
    "parent": "doc/compiler/components.html",
    "contents": "<template id=\"x-button\">\n\n</template>\n\n<style>\n  x-button {\n    /* component styles */\n  }\n</style>\n\n<script>\n  skate.define('x-button', {});\n</script>\n"
  },
  {
    "file": "doc/compiler/x-icon.html",
    "parent": "doc/compiler/components.html",
    "contents": "<template id=\"x-icon\">\n\n</template>\n\n<style>\n  x-icon {\n    /* component styles */\n  }\n</style>\n\n<script>\n  skate.define('x-icon', {});\n</script>\n"
  }
]
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
      "contents": "\n  x-button {\n    /* component styles */\n  }\n",
      "inline": true
    },
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-icon.html",
      "contents": "\n  x-icon {\n    /* component styles */\n  }\n",
      "inline": true
    }
  ],
  "js": [
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-button.html",
      "contents": "\n  skate.define('x-button', {});\n",
      "inline": true
    },
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-icon.html",
      "contents": "\n  skate.define('x-icon', {});\n",
      "inline": true
    }
  ],
  "tpl": [
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-button.html",
      "contents": "<template id=\"x-button\">\n\n</template>",
      "inline": true
    },
    {
      "parent": "doc/compiler/components.html",
      "file": "doc/compiler/x-icon.html",
      "contents": "<template id=\"x-icon\">\n\n</template>",
      "inline": true
    }
  ],
  "options": {
    "selectors": {
      "import": "link[rel=\"import\"][href]",
      "styles": "style, link[rel=\"stylesheet\"][href]",
      "scripts": "script",
      "templates": "template, link[rel=\"template\"][href]"
    }
  }
}
```

### Transform

The transform phase takes the parsed result and compiles the `<template>` elements to javascript functions that can be called from the component `render()` function.

```json
{ files: null,
  babel: {},
  out: undefined,
  name: 'components',
  html: undefined,
  css: undefined,
  js: undefined,
  force: false,
  eol: undefined,
  trim: 
   { inline: true,
     newlines: true,
     pattern: /^(  |\t){1,1}/,
     lines: true },
  compiler: { attr: 'id' },
  selectors: 
   { import: 'link[rel="import"][href]',
     styles: 'style, link[rel="stylesheet"][href]',
     scripts: 'script',
     templates: 'template, link[rel="template"][href]' } }
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
  ],
  "options": {
    "files": null,
    "babel": {
      "plugins": [
        null,
        null
      ],
      "filename": "doc/compiler/x-icon.html"
    },
    "name": "components",
    "force": false,
    "trim": {
      "inline": true,
      "newlines": true,
      "pattern": {},
      "lines": true
    },
    "compiler": {
      "attr": "id",
      "dom": {
        "normalizeWhitespace": true,
        "withDomLvl1": true,
        "xmlMode": false,
        "decodeEntities": true
      },
      "normalize": true,
      "literals": {},
      "skate": "skate",
      "vdom": "vdom",
      "element": "element",
      "text": "text",
      "name": "render",
      "arg": "elem",
      "main": "template",
      "templates": "templates"
    },
    "selectors": {
      "import": "link[rel=\"import\"][href]",
      "styles": "style, link[rel=\"stylesheet\"][href]",
      "scripts": "script",
      "templates": "template, link[rel=\"template\"][href]"
    }
  }
}
```

Note that some data has been omitted from the example output for brevity.

### Generate

After transformation the generate phase will concatenate all the css and transformed javascript code.

```json
{
  "stylesheet": "x-button {\n  /* component styles */\n}\n\nx-icon {\n  /* component styles */\n}",
  "javascript": "const templates = {\n  \"x-button\": function render(elem) {},\n  \"x-icon\": function render(elem) {}\n};\n\nfunction template(elem) {\n  return templates[elem.tagName](elem);\n}\n\nskate.define('x-button', {});\n\nskate.define('x-icon', {});"
}
```

Note that some data has been omitted from the example output for brevity.

### Write

The final phase writes the generated files to disc.

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 5, 2016

