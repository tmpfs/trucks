# Trucks

[![Build Status](https://travis-ci.org/tmpfs/trucks.svg?v=3)](https://travis-ci.org/tmpfs/trucks)
[![npm version](http://img.shields.io/npm/v/trucks.svg?v=3)](https://npmjs.org/package/trucks)
[![Coverage Status](https://coveralls.io/repos/tmpfs/trucks/badge.svg?branch=master&service=github&v=5)](https://coveralls.io/github/tmpfs/trucks?branch=master)

> Web component compiler and package manager

Compiles web components declared as HTML to separate Javascript, CSS and HTML files.

Designed primarily for [skatejs][] with support for [polymer][] coming soon.

Uses ES6 code transpiled for `node@4.x` compatibility.

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

Another benefit of this library is that it converts [HTML Imports][html-imports] to *compile time only* which is important as [Mozilla will not ship HTML Imports][mozilla-webcomponents], one less polyfill!

---

- [Install](#install)
- [Abstract](#abstract)
  - [Polymer](#polymer)
  - [Skate](#skate)
  - [React](#react)
  - [Trucks](#trucks)
- [Usage](#usage)
- [Components](#components)
  - [Templates](#templates)
  - [Style Scopes](#style-scopes)
  - [Dependencies](#dependencies)
  - [Private Dependencies](#private-dependencies)
- [Plugins](#plugins)
- [Transforms](#transforms)
  - [Lifecycle](#lifecycle)
  - [Visitors](#visitors)
  - [Configuration](#configuration)
- [Transform Plugins](#transform-plugins)
  - [Compilers](#compilers)
  - [Preprocessors](#preprocessors)
  - [Styles](#styles)
  - [Miscellaneous](#miscellaneous)
- [Documentation](#documentation)
- [License](#license)

---

## Usage

Programmatic usage:

```javascript
const trucks = require('trucks');

trucks(
  {
    files: ['doc/example/components.html'],
    transforms: ['skate'],
    out: 'target',
    force: true
  },
  (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
```

For command line usage see [trucks-cli][].

## Components

Components follow the [polymer][] style definition to encourage encapsulating all the aspects of a component into a single file:

```html
<dom-module id="x-icon">
  <template>
    <style>
      /* component styles (shadow scope) */
    </style>
    <!-- template markup -->
  </template>

  <style>
    /* global styles (document scope) */
  </style>

  <script>
    /* component definition and logic */
  </script>
</dom-module>
```

To allow related components to be grouped together you may wish to use an index file:

```html
<link rel="import" href="x-icon.html">
<link rel="import" href="x-button.html">
```

Complex components can reference external files if you prefer which is particularly useful for editors that automatically lint javascript and stylesheets:

```html
<dom-module id="x-icon">
  <link rel="template" href="x-icon-template.html">
  <link rel="stylesheet" href="x-icon.css">
  <script src="x-icon.js"></script>
</dom-module>
```

Note the use of the `rel="template"` attribute if you want to use an external HTML file for the component template.

To include the resulting component files in your HTML page(s) load the compiled styles and javascript:

```html
<link rel="stylesheet" href="components.css">
<script src="components.js"></script>
```

### Templates

The parser differentiates between a primary template and template partials. The primary template is one with no `id` attribute (it inherits from the `<dom-module>` identifier) whilst partials are those with identifiers:

```html
<dom-module id="x-button">
  <!-- primary template -->
  <template></template>
  <!-- template partial, fully qualified id: x-button-icon -->
  <template id="icon"></template>
</dom-module>
```

There may only be one primary template in a module and template partial `id` attributes are prefixed with the component identifier.

#### Template Styles

Because all styles within templates should be applied to the shadow DOM when styles are declared in multiple templates they may be hoisted, for example:

```html
<dom-module id="x-button">
  <template>
    <style>
      p {margin: 0;}
    </style>
  </template>
  <template id="icon">
    <style>
      i {padding: 0;}
    </style>
  </template>
</dom-module>
```

Is equivalent to:

```html
<dom-module id="x-button">
  <template>
    <style>
      p {margin: 0;}
      i {padding: 0;}
    </style>
  </template>
</dom-module>
```

### Style Scopes

Style elements whether they are inline (`<style>`) or external (`<link>`) are given a scope, when they are directly within the `<dom-module>` element they are deemed to be of a document scope and are written to the primary output stylesheet.

```html
<dom-module id="x-icon">
  <style>
    /* global styles (document scope) written to `components.css` */
  </style>
</dom-module>
```

When the style element appears within a `<template>` element it is deemed to be a component style and given a shadow scope. These styles should be written within the shadow DOM to ensure they are applied correctly.

```html
<dom-module id="x-icon">
  <template>
    <style>
      /* component styles (shadow scope) written to the shadow DOM for the component */
    </style>
  </template>
</dom-module>
```

The shadow scope is preferred but you can use the document scope if you need to use shadow piercing selectors to style the component:

```html
<dom-module id="x-icon">
  <template>
    <em>${this.title}</em>
  </template>
  <style>
    x-icon /deep/ em {
      font-size: 2rem;
    }
  </style>
</dom-module>
```

Note that the `/deep/` and `::shadow` selectors are deprecated and should be avoided.

### Dependencies

Components can declare dependencies on other components using an HTML import in the component file. Consider a button component that depends upon an icon component; first define the component collection `components.html`:

```html
<link rel="import" href="x-button.html">
```

Then define the button component and import the icon component dependency `x-button.html`:

```html
<import rel="import" href="x-icon.html">

<dom-module id="x-button">
  <template>
    <x-icon><x-icon>
  </template>

  <!-- implement component styles and script -->
</dom-module>
```

And define the component dependency `x-icon.html`:

```html
<dom-module id="x-icon">
  <!-- implement component markup, styles and script -->
</dom-module>
```

### Private Dependencies

A component file can declare multiple components in a single file which can be useful when a component's dependencies are not intended to be used independently. In this case they are referred to as *private dependencies*, for example:

```html
<dom-module id="x-icon">
  <template>
    <!-- component markup -->
  </template>

  <style>
    x-icon {
      /* styles for icon component */
    }
  </style>

  <script>
    skate.define('{{id}}', {/* component implementation */});
  </script>
</dom-module>

<dom-module id="x-button">
  <template>
    <x-icon><x-icon>
  </template>

  <style>
    x-button {
      /* styles for button component */
    }
  </style>

  <script>
    skate.define('{{id}}', {/* component implementation */});
  </script>
</dom-module>
```

## Plugins

Plugins execute the main compiler phases that are bundled with the core libary:

* [load][] Read the HTML import tree
* [parse][] Parse the `<dom-module>` elements
* [transform][] Run tree transformations
* [generate][] Create output file contents
* [write][] Write output files to disc

An additional plugin [sources][] reads the entire component tree by combining the [load][] and [parse][] plugins.

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

## Transforms

Transforms are a different type of plugin that are executed when the entire component tree is available.

A transform plugin returns a map of visitor functions and/or lifecycle callbacks:

```javascript
function plugin(state, conf) {
  return {
    '*': (node, cb) => {
      cb(); 
    }
  }
}
```

### Lifecycle

Lifecycle callbacks are functions that hook into events when iterating the component tree:

* `begin` Called before the tree is walked.
* `enter` Called when entering a node before visitor functions are invoked.
* `leave` Called when leaving a node after visitor functions have been invoked.
* `end` Called when the tree walk is complete.

The `begin` and `end` functions are passed the component tree so the signature is always:

```javascript
function(node, cb);
```

For example you may want to collect all nodes of a type and operate once the walk is completed:

```javascript
function plugin(state, conf) {
  const styles = [];
  return {
    end: (node, cb) => {
      // operate on the list of styles 
      cb();
    },
    Style: (node, cb) => {
      styles.push(node);
      cb(); 
    }
  }
}
```

### Visitors

Each key in the returned map is evaluated to determine whether the visitor function wants to see a particular node, the wildcard `*` matches all nodes. Available node types are:

* `Tree` Visit tree nodes.
* `File` Visit file nodes.
* `Module` Visit module nodes.
* `Component` Visit component nodes.
* `Template` Visit template nodes.
* `Style` Visit style nodes.
* `Script` Visit script nodes.

### Configuration

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

## Transform Plugins

Existing transform plugins are in [packages](https://github.com/tmpfs/trucks/blob/master/packages).

### Compilers

* [skate][] Compiles HTML templates to render functions.

### Preprocessors

* [less][] Preprocess less sources.
* [sass][] Preprocess sass sources.
* [stylus][] Preprocess stylus sources.
* [trim][] Trim whitespace from inline styles and scripts.

### Styles

* [style-extract][] Write stylesheets for each component.
* [style-inject][] Read and overwrite stylesheets for each component.

### Miscellaneous

* [tree][] Humanize the component tree using [archy][].

## Documentation

An example for [skatejs][] is shown in [EXAMPLE](https://github.com/tmpfs/trucks/blob/master/doc/EXAMPLE.md), source files are in [doc/example](https://github.com/tmpfs/trucks/blob/master/doc/example).

For the API docs see [API](https://github.com/tmpfs/trucks/blob/master/doc/API.md), an overview of the available options is in [OPTIONS](https://github.com/tmpfs/trucks/blob/master/doc/OPTIONS.md). For insights into the compiler phases and data structures see [COMPILER](https://github.com/tmpfs/trucks/blob/master/doc/COMPILER.md).

The [ROADMAP](https://github.com/tmpfs/trucks/blob/master/doc/ROADMAP.md) has some ideas for future features.

Information on how to build this project is in [DEVELOPER](https://github.com/tmpfs/trucks/blob/master/doc/DEVELOPER.md).

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 20, 2016

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
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[tree]: https://github.com/tmpfs/trucks/blob/master/packages/transform-tree
[style-extract]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-extract
[style-inject]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-inject
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

