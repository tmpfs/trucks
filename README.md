# Trucks

[![Build Status](https://travis-ci.org/tmpfs/trucks.svg?v=2)](https://travis-ci.org/tmpfs/trucks)
[![npm version](http://img.shields.io/npm/v/trucks.svg?v=2)](https://npmjs.org/package/trucks)
[![Coverage Status](https://coveralls.io/repos/tmpfs/trucks/badge.svg?branch=master&service=github&v=4)](https://coveralls.io/github/tmpfs/trucks?branch=master)

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
  - [Dependencies](#dependencies)
  - [Private Dependencies](#private-dependencies)
  - [Notes](#notes)
- [Plugins](#plugins)
- [Transforms](#transforms)
- [Roadmap](#roadmap)
  - [Packages](#packages)
  - [Styles](#styles)
  - [Documentation](#documentation)
- [Example](#example)
- [Options](#options)
- [Compiler](#compiler)
- [API](#api)
- [Developer](#developer)
- [License](#license)

---

## Usage

Programmatic usage:

```javascript
const trucks = require('trucks');

trucks(
  {
    files: ['example/components.html'],
    transforms: ['skate'],
    out: 'target'
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

Component collections declare a group of components using HTML imports to allow related components to be grouped together.

```html
<link rel="import" href="x-icon.html">
<link rel="import" href="x-button.html">
```

These are the files you pass to the library when compiling components.

Components follow the [polymer][] style definition to encourage encapsulating all the aspects of a component into a single file:

```html
<dom-module id="x-icon">
  <template>
    <style>
      /* inline component styles */
    </style>
    <!-- template markup -->
  </template>

  <style>
    /* global component styles */
  </style>

  <script>
    /* component definition and logic */
  </script>
</dom-module>
```

During compilation all `<template>` elements are concatenated to an HTML file, styles are concatenated into a stylesheet and scripts are concatenated into a javascript file.

You can then include the resulting component files in your HTML page(s):

```html
<link rel="stylesheet" href="components.css">
<script src="components.js"></script>
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

### Notes

Components defined for [skatejs][] can ignore the HTML file as the templates are compiled to javascript; the command line interface will not generate an HTML file as it compiles for [skatejs][] by default.

When authoring components using [polymer][] you would need to include the resulting HTML page containing all `<template>` elements in to your HTML page(s), how you do this depends upon your build process. Use the `--extract` option when compiling with the command line interface to also generate an HTML file containing the template elements.

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
  return function handler(state, cb) {
    cb(null, state); 
  }
}
```

Closures returned by the plugin functions are executed asynchronously in series and may modify the state object.

The `state` object contains several useful fields but most noteworthy are:

* `options` Reference to the processing options
* `tree` Component tree populated by the [load][] and [parse][] plugins

You may configure the plugins used for low-level access. For example if you just wanted to print the HTML import tree:

```javascript
const options = {
  files: ['components.html'],
  plugins: [trucks.LOAD /* add custom tree plugin */]
};
```

To configure a plugin you can set a plugin configuration object:

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

## Transforms

Transforms are a different type of plugin that are executed when the entire component tree is available.

A transform plugin returns a map of visitor functions:

```javascript
function plugin(state, conf) {
  return {
    '*': function handler(node, cb) {
      cb(null, state); 
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
## Roadmap

These features are not available yet however this section describes how they may be implemented.

### Packages

Sharing web components in a package manager agnostic format would be very useful. Currently component groups only support loading from the local filesystem but this should be refactored to a plugin system that maps to a scheme URL allowing loading components from various locations.

For example we could register a `trucks-npm` plugin and load components from [npm][] packages:

```html
<link rel="import" href="npm://@scope/package">
```

Suggested schemes to implement:

* `npm://`
* `https://`
* `git+ssh://`

Later support could be added for:

* `bower://`
* `jspm://`
* `component://`

### Styles

Whilst experimenting with [polymer][] it was noticed that there is a certain amount of redundancy when styling components authored by third parties. Component authors need to provide default styles for their components whilst component consumers normally need to modify the default styles.

It would not be very difficult to allow a pre-compile phase that maps component identifiers to stylesheets that can replace or be merged with the default styles provided by the component author.

This would reduce the file size of component styles and prevent consumers from battling against CSS specificity issues when attempting to override the default component styles.

The suggestion is that this would be implemented as [postcss plugins][postcss].

### Documentation

Component authors should have a consistent approach to writing documentation for the created components so that users can easily see the component attributes, events and other aspects of the component (dependencies etc).

The suggestion is that in the future we could use the [mkapi][] and [mkparse][] libraries to generate markdown documentation for components, a draft idea of how this would look:

```html
<!--
  Video player component.

  @component x-video

  @attr {Boolean} playing start or stop the video playback.

  @event start emitted when the video starts playing.
  @event stop emitted when the video stops playing.

  @dependency x-play-button 
  @dependency x-volume-button 
  @dependency x-slider
-->
<x-video playing></x-video>

<template id="x-video">
  <!-- component markup -->
</template>

<style>
  /* component styles */
</style>

<script>
  /* component implementation */
</script>
```

The generated markdown document would render the documentation comments followed by fenced code blocks showing the example usage(s) and the component implementation, these pages could then be converted to HTML (with source code higlighting) to be published online as static web pages.

## Example

An example for [skatejs][] is shown in [EXAMPLE](https://github.com/tmpfs/trucks/blob/master/doc/EXAMPLE.md), source files are in [doc/example](https://github.com/tmpfs/trucks/blob/master/doc/example).

## Options

An overview of the available options is in [OPTIONS](https://github.com/tmpfs/trucks/blob/master/doc/OPTIONS.md) see [API](https://github.com/tmpfs/trucks/blob/master/doc/API.md) for more detail.

## Compiler

For insights into the compiler phases and data structures see [COMPILER](https://github.com/tmpfs/trucks/blob/master/doc/COMPILER.md).

## API

For the API docs see [API](https://github.com/tmpfs/trucks/blob/master/doc/API.md).

## Developer

Information on how to build this project is in [DEVELOPER](https://github.com/tmpfs/trucks/blob/master/doc/DEVELOPER.md).

## License

MIT

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

