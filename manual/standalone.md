# Manual

---

- [Introduction](#introduction)
  - [Polymer](#polymer)
  - [Skate](#skate)
  - [React](#react)
  - [Trucks](#trucks)
- [Components](#components)
  - [Templates](#templates)
    - [Template Styles](#template-styles)
  - [Style Scopes](#style-scopes)
  - [Dependencies](#dependencies)
  - [Private Dependencies](#private-dependencies)
- [Packages](#packages)
  - [Package Dependencies](#package-dependencies)
  - [Package Example](#package-example)
- [Plugins](#plugins)
  - [Plugin Types](#plugin-types)
    - [Core Plugins](#core-plugins)
    - [Protocol Plugins](#protocol-plugins)
    - [Transform Plugins](#transform-plugins)
    - [Generator Plugins](#generator-plugins)
  - [Writing Plugins](#writing-plugins)
  - [Loading Plugins](#loading-plugins)
  - [Configuring Plugins](#configuring-plugins)
- [Protocols](#protocols)
  - [Default Protocol](#default-protocol)
  - [Using Protocol Plugins](#using-protocol-plugins)
  - [Writing Protocol Plugins](#writing-protocol-plugins)
  - [Example Protocol](#example-protocol)
- [Transforms](#transforms)
  - [Lifecycle](#lifecycle)
  - [Visitors](#visitors)
  - [Configuration](#configuration)
- [Appendix](#appendix)

---

## Introduction

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

## Components

Components follow the [polymer][] style definition to encourage encapsulating all the aspects of a component into a single file:

```html
<!-- @component x-component -->
<dom-module id="x-component">
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

<!-- @usage -->
<x-component></x-component>
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
  <!-- template partial -->
  <template id="icon"></template>
</dom-module>
```

There may only be one primary template in a module.

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

## Packages

The recommended way to package a component is to create an [npm][] package add a `components.html` entry point and `trucks.js` compiler configuration.

Once the package has been published to the registry it can be installed using the `npm:` protocol:

```shell
trucks npm://trucks-example-skate-component
```

```html
<link rel="import" href="npm://trucks-example-skate-component@^1.0.0">
```

Using [npm][] is the preferred mechanism for semantic versioning and so that component dependencies can be automatically resolved at compile time.

### Package Dependencies

If you need to add compiler plugins to your package you should add them to the `dependencies` section so that they are installed at compile time.

### Package Example

An example `package.json` and corresponding `trucks.js` compiler configuration:

```json
{
  "name": "trucks-example-skate-component",
  "version": "1.0.5",
  "description": "Skate compiler transform example",
  "author": "muji <noop@xpm.io>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tmpfs/trucks"
  },
  "engines": {
    "node": ">=4.0"
  },
  "dependencies": {
    "skatejs": "~1.0.0-beta.19",
    "trucks-generator-page": "~1.0.1",
    "trucks-transform-bundle": "*",
    "trucks-transform-csp": "*",
    "trucks-transform-skate": "*",
    "trucks-transform-trim": "*",
    "trucks-transform-usage": "*"
  },
  "devDependencies": {
    "express": "~4.14.0"
  },
  "scripts": {
    "clean": "rm -rf build",
    "prebuild": "npm run clean",
    "build": "trucks"
  }
}
```

```javascript
const options = {
  files: [__dirname + '/components.html'],
  transforms: ['trim', 'csp', 'skate', 'bundle', 'usage'],
  generators: ['page'],
  out: 'build',
  force: true,
  css: false,
  html: false,
  page: {
    files: {
      'template.html': 'index.html'
    } 
  },
  write: {
    exclude: /\.?usage.html$/
  },
  conf: {
    transforms: {
      csp: {
        sha: 'sha256',
        statics: true 
      },
      bundle: {
        js: [require.resolve('skatejs/dist/index-with-deps.js')]
      }
    }
  }
}

module.exports = options;
```

## Plugins

### Plugin Types

#### Core Plugins

Core plugins are bundled with the [trucks-compiler][] libary and run the main compiler phases:

* [load][] Read the HTML import tree.
* [parse][] Parse the `<dom-module>` elements.
* [transform][] Run tree transformations.
* [generate][] Create output file contents.
* [write][] Write output files to disc.

An additional plugin [sources][] reads the entire component tree by combining the [load][] and [parse][] plugins.

The [trucks-compiler][] library exposes constants for each of the core plugins so you can avoid string literals when modifying the plugins list:

```javascript
const trucks = require('trucks-compiler')
    , options = {
        files: ['components.html'],
        plugins: [trucks.LOAD, trucks.PARSE]
      };
```

Typically you should not need to modify the `plugins` list but it can be useful when you need a subset of the core compiler phases to be executed, for example to inspect the component tree without writing any files.

#### Protocol Plugins

Protocol plugins are initialized by the [load][] phase they are responsible for registering a protocol with a class that will resolve the URL to component files or an alternative compiler configuration. See the [http][resolver-http] plugin implementation.

#### Transform Plugins

Transform plugins are executed by the [transform][] phase when the entire component tree is ready. They should perform transformations on the component tree creating output files when needed. See the [csp][transform-csp] plugin implementation.

#### Generator Plugins

Generator plugins are executed by the [generate][] phase and may be used to create additional output files or perform extra processing after transformations have been applied. See the [page][generator-page] plugin implementation.

### Writing Plugins

Plugins are named functions that are passed the compiler state object and a configuration for the plugin and return a closure.

```javascript
function plugin(state, conf) {
  return function(state, cb) {
    cb(null, state); 
  }
}
```

Closures returned by the plugin functions are executed asynchronously (except protocol plugins which are synchronous) in series and may modify the state object.

Plugin functions may return an array of plugin functions which is useful to group related plugins, see the [sources][] plugin for an example.

### Loading Plugins

To load a particular plugin use the corresponding array option:

```javascript
const options = {
  files: ['components.html'],
  plugins: [trucks.LOAD]
};
```

Plugins may be functions (or an object with a `plugin` function) but typically are declared as strings.

When plugins are declared as strings and do not resolve to an absolute path they are treated as modules to require using a naming convention.

Core plugins use the `trucks-plugin` prefix so in the above example the package `trucks-plugin-load` will be loaded.

Protocol plugins use the `protocols` array and the `trucks-resolver` prefix. For example to load the `trucks-resolver-http` plugin:

```javascript
const options = {
  files: ['components.html'],
  protocols: ['http']
};
```

Transform plugins are defined in the `transforms` array and use the `trucks-transform` prefix. For example to load the `trucks-transform-csp` plugin:

```javascript
const options = {
  files: ['components.html'],
  transforms: ['csp']
};
```

Generator plugins are defined in the `generators` array and use the `trucks-generator` prefix. For example to load the `trucks-generator-page` plugin:

```javascript
const options = {
  files: ['components.html'],
  generators: ['page']
};
```

### Configuring Plugins

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

## Protocols

Protocol plugins are classes mapped to URL protocols and allow the file load mechanism to be extended so that users can distribute and install web components from remote resources or implement custom protocols.

Protocols are used for the input `files` array as well as HTML imports so that the following are equivalent:

```shell
trucks npm://trucks-example-skate-component
```

```html
<link rel="import" href="npm://trucks-example-skate-component">
```

See the [file][resolver-file], [http][resolver-http] and [npm][resolver-npm] plugins for example implementations.

### Default Protocol

By default a protocol handler for the `file:` scheme is registered by the [load][] plugin so HTML imports can be loaded from the local file system.

Note that the command line interface adds support for the [http][resolver-http] and [npm][resolver-npm] protocols.

### Using Protocol Plugins

To enable a protocol first install the package (`npm i trucks-resolver-http --save-dev`) and then enable the plugin in the `protocols` list:

```javascript
const options = {
  files: ['components.html'],
  protocols: ['http']
}
```

You can now use HTTP and HTTPS imports:

```html
<link rel="import" href="https://example.com/components.html">
```

### Writing Protocol Plugins

Protocol plugins follow the standard plugin function signature `function(state, conf)` however unlike other plugins they are invoked synchronously and passed a reference to the protocol registry.

The plugin function should return a closure that registers protocol classes:

```javascript
function plugin(state, conf) {
  return (registry) => {
    registry.register(PROTOCOL_STRING, PROTOCOL_CLASS);
  }
}
```

Protocol classes must be a subclass of the [core resolver][resolver-core].

### Example Protocol

The structure for a hypothetical FTP protocol plugin:

```javascript
const Protocol = require('trucks-resolver-core');

class FtpProtocol extends Protocol {
  /* plugin implementation */
}

function ftp(state, conf) {
  return (registry) => {
    registry.register('ftp:', FtpProtocol);
    registry.register('sftp:', FtpProtocol);
  }
}
```

## Transforms

Transforms are plugins executed by the [transform][] plugin when the entire component tree is available.

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

## Appendix

More developer documentation is in the [appendix](appendix.md).

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on August 8, 2016

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
[manual]: https://github.com/tmpfs/trucks/blob/master/manual
[examples]: https://github.com/tmpfs/trucks/blob/master/examples
[trucks]: https://github.com/tmpfs/trucks
[trucks-cli]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli
[trucks-compiler]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-compiler
[sources]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-sources
[load]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-load
[parse]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-parse
[transform]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-transform
[generate]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-generate
[write]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-write
[transform-csp]: https://github.com/tmpfs/trucks/blob/master/packages/transform-csp
[bundle]: https://github.com/tmpfs/trucks/blob/master/packages/transform-bundle
[copy]: https://github.com/tmpfs/trucks/blob/master/packages/transform-copy
[skate]: https://github.com/tmpfs/trucks/blob/master/packages/transform-skate
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[tree]: https://github.com/tmpfs/trucks/blob/master/packages/transform-tree
[usage]: https://github.com/tmpfs/trucks/blob/master/packages/transform-usage
[style-extract]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-extract
[style-inject]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-inject
[resolver-core]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-core
[resolver-file]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-file
[resolver-http]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-http
[resolver-npm]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-npm
[generator-page]: https://github.com/tmpfs/trucks/blob/master/packages/generator-page
[standalone-manual]: https://github.com/tmpfs/trucks/blob/master/manual/standalone.md
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

