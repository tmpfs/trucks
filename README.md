# Trucks

[![Build Status](https://travis-ci.org/tmpfs/trucks.svg?v=2)](https://travis-ci.org/tmpfs/trucks)
[![npm version](http://img.shields.io/npm/v/trucks.svg?v=2)](https://npmjs.org/package/trucks)
[![Coverage Status](https://coveralls.io/repos/tmpfs/trucks/badge.svg?branch=master&service=github&v=4)](https://coveralls.io/github/tmpfs/trucks?branch=master)

> Web component compiler and package manager

Compiles web components declared as HTML to separate Javascript, CSS and HTML files. Supports [skatejs][] and [polymer][].

## Install

```
npm i trucks --save-dev
```

For the command line interface see [trucks-cli][].

## Abstract

[Web components][webcomponents] are a collection of emerging standards that allow developers to create re-usable custom user interface elements.

The web components specifications are:

* [Shadow DOM][shadow-dom]
* [Custom Elements][custom-elements]
* [HTML Imports][html-imports]
* [HTML Templates][html-templates]

At the time of writing very few browsers support all of these emerging standards so polyfills are required.

There are several problems with the state of the current frameworks.

### Polymer

The [polymer project][polymer] has a large suite of components but these components are all defined using inline scripts and inline styles which is very convenient from an authoring point of view (component encapsulation) but has issues when you need a strict [content security policy][csp] that disables inline styles and scripts.

### Skate

The [skatejs][] project has a very efficient design using a virtual dom that incrementally renders component view changes. It is the smallest of the frameworks and because it does not depend upon [HTML Templates][html-templates] or [HTML Imports][html-imports] a component can be created using javascript and css but this makes it difficult to easily encapsulate a component definition into a single file.

### React

The [react framework][react] is [not tracking the webcomponents standards][react-webcomponents] and therefore for those that prefer to use web standards it's not really an option. But you can compile [skatejs][] component definitions to react components using the [react integration][react-integration] module.

### Trucks

The [trucks][] library aims to bring component encapsulation to [skatejs][] and allow [polymer][] component definitions to be compiled to bypass the [content security policy][csp] problem.

---

- [Install](#install)
- [Abstract](#abstract)
  - [Polymer](#polymer)
  - [Skate](#skate)
  - [React](#react)
  - [Trucks](#trucks)
- [Usage](#usage)
- [Overview](#overview)
- [Components](#components)
- [Compiler](#compiler)
  - [Load](#load)
  - [Parse](#parse)
  - [Transform](#transform)
  - [Generate](#generate)
- [API](#api)
- [Developer](#developer)
- [License](#license)

---

## Usage

Programmatic usage:

```javascript
const trucks = require('trucks');

trucks({files: ['example/components.html']}, (err, res) => {
  if(err) {
    throw err; 
  }
  console.log(res);
});
```

## Overview

The library takes an HTML template and compiles it to a `render` function.

An HTML template such as:

```html
<template id="x-blog-post">
  <div class="post">
    <h3>${elem.title}</h3>
    <p>Article content</p>
  </div>
</template>
```

Will result in the compiled function:

```javascript
function render(elem) {
  skate.vdom.element("div", {
    class: "post"
  }, () => {
    skate.vdom.element("h3", () => {
      skate.vdom.text(`${ elem.title }`);
    });
    skate.vdom.element("p", () => {
      skate.vdom.text(`Article content`);
    });
  });
}
```

Note that whitespace in the source template is normalized by default and that support for template literals needs to be enabled when compiling.

This compile phase is not required for [polymer][] components as they already use HTML templates.

## Components

Component collections declare a group of components using HTML imports to allow related components to be grouped together.

```html
<link rel="import" href="x-icon.html">
<link rel="import" href="x-button.html">
```

These are the files you pass to the library when compiling components.

Components follow the [polymer][] style definition to encourage encapsulating all the aspects of a component into a single file:

```html
<template id="x-icon">
  <!-- template markup -->
</template>

<style>
  /* template styles */
</style>

<script>
  /* component definition and logic */
</script>
```

During compilation all `<template>` elements are concatenated to an HTML file, styles are concatenated into a stylesheet and scripts are concatenated into a javascript file.

You can then include the resulting component files in your HTML page(s):

```html
<link rel="stylesheet" href="components.css">
<script src="components.js"></script>
```

Complex components can reference external files if you prefer:

```html
<link rel="import" href="x-icon-template.html">
<link rel="stylesheet" href="x-icon.css">
<script src="x-icon.js"></script>
```

Components defined for [skatejs][] can ignore the HTML file as the templates are compiled to javascript.

When authoring components using [polymer][] you would need to include the resulting HTML page containing all `<template>` elements in to your HTML page(s), how you do this depends upon your build process.

## Compiler

The compiler executes the following phases:

* `load`: Load all source HTML files given with the `files` option and resolve the HTML imports.
* `parse`: Parse the imported files resolving styles, javascript and template elements.
* `transform`: Transform the imported component files compiling `<template>` elements to javascript.
* `generate`: Convert the transformed components to css and javascript strings.
* `write`: Write the generated styles and javascript to files.

### Load

Given a components file [components.html](https://github.com/tmpfs/trucks/blob/master/example/compiler/components.html) such as:

```html
<link rel="import" href="x-icon.html">
<link rel="import" href="x-button.html">
```

The load phase will build the result object:

```json
{
  "example/compiler/components.html": [
    {
      "file": "example/compiler/x-icon.html",
      "contents": "<template id=\"x-icon\">\n\n</template>\n\n<style>\n  x-icon {\n    /* components styles */\n  }\n</style>\n\n<script>\n  skate.define('x-icon', {});\n</script>\n"
    },
    {
      "file": "example/compiler/x-button.html",
      "contents": "<template id=\"x-button\">\n\n</template>\n\n<style>\n  x-button {\n    /* components styles */\n  }\n</style>\n\n<script>\n  skate.define('x-button', {});\n</script>\n"
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
      "parent": "example/compiler/components.html",
      "file": "example/compiler/x-icon.html",
      "contents": "\n  x-icon {\n    /* components styles */\n  }\n",
      "inline": true
    },
    {
      "parent": "example/compiler/components.html",
      "file": "example/compiler/x-button.html",
      "contents": "\n  x-button {\n    /* components styles */\n  }\n",
      "inline": true
    }
  ],
  "js": [
    {
      "parent": "example/compiler/components.html",
      "file": "example/compiler/x-icon.html",
      "contents": "\n  skate.define('x-icon', {});\n",
      "inline": true
    },
    {
      "parent": "example/compiler/components.html",
      "file": "example/compiler/x-button.html",
      "contents": "\n  skate.define('x-button', {});\n",
      "inline": true
    }
  ],
  "tpl": [
    {
      "parent": "example/compiler/components.html",
      "file": "example/compiler/x-icon.html",
      "contents": "<template id=\"x-icon\">\n\n</template>",
      "inline": true
    },
    {
      "parent": "example/compiler/components.html",
      "file": "example/compiler/x-button.html",
      "contents": "<template id=\"x-button\">\n\n</template>",
      "inline": true
    }
  ],
  "options": {}
}
```

### Transform

The transform phase takes the parsed result and compiles the `<template>` elements to javascript functions that can be called from the component `render()` function.

> TODO: implement and document the transform phase

```json
{
  "js": [
    {
      "parent": "example/compiler/components.html",
      "file": "example/compiler/x-icon.html",
      "contents": "\n  skate.define('x-icon', {});\n",
      "inline": true,
      "code": "\nskate.define('x-icon', {});"
    },
    {
      "parent": "example/compiler/components.html",
      "file": "example/compiler/x-button.html",
      "contents": "\n  skate.define('x-button', {});\n",
      "inline": true,
      "code": "\nskate.define('x-button', {});"
    }
  ],
  "options": {}
}
```

Note that some data has been omitted from the example output for brevity.

### Generate

After transformation the generate phase will concatenate all the css and transformed javascript code.

```json
{
  "stylesheet": "\n  x-icon {\n    /* components styles */\n  }\n\n\n  x-button {\n    /* components styles */\n  }\n",
  "javascript": "\nskate.define('x-icon', {});\n\nskate.define('x-button', {});"
}
```

Note that some data has been omitted from the example output for brevity.

## API

For the API docs see [API.md](https://github.com/tmpfs/trucks/blob/master/doc/API.md).

## Developer

Information on how to build this project is in [DEVELOPER.md](https://github.com/tmpfs/trucks/blob/master/doc/DEVELOPER.md).

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 1, 2016

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
[csp]: http://content-security-policy.com/
[mkdoc]: https://github.com/mkdoc/mkdoc
[jshint]: http://jshint.com
[jscs]: http://jscs.info

