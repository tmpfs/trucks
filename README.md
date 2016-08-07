# Trucks

[![Build Status](https://travis-ci.org/tmpfs/trucks.svg?v=7)](https://travis-ci.org/tmpfs/trucks)
[![npm version](http://img.shields.io/npm/v/trucks.svg?v=7)](https://npmjs.org/package/trucks)
[![Coverage Status](https://coveralls.io/repos/tmpfs/trucks/badge.svg?branch=master&service=github&v=7)](https://coveralls.io/github/tmpfs/trucks?branch=master)

> Framework agnostic, extensible web component compiler and package manager

Compiles web components declared as HTML to separate Javascript, CSS and HTML files.

Designed primarily for [skatejs][] with support for [polymer][] coming soon.

## Install

To install the command line interface run:

```
npm i -g trucks
```

To use the compiler library programatically:

```
npm i trucks-compiler --save-dev
```

See [trucks-compiler][] for usage and more documentation.

## Getting Started

The quickest way to get started is to install the command line interface, compile a package and open `build/index.html` in a recent version of chrome.

```shell
trucks npm://trucks-example-skate-component -o build
```

Or from the file system:

```shell
trucks examples/skate-component/components.html -o build
```

In each case the [trucks.js](https://github.com/tmpfs/trucks/blob/master/examples/skate-component/trucks.js) compiler configuration file is used.

---

- [Install](#install)
- [Getting Started](#getting-started)
- [Manual](#manual)
- [Examples](#examples)
- [Plugin List](#plugin-list)
  - [Core](#core)
  - [Resolvers](#resolvers)
  - [Transforms](#transforms)
    - [Compilers](#compilers)
    - [Preprocessors](#preprocessors)
    - [Styles](#styles)
    - [Miscellaneous](#miscellaneous)
  - [Generators](#generators)
- [License](#license)

---

## Manual

More documentation is in the [manual][].

## Examples

Component projects are in the [examples][] directory.

## Plugin List

Plugins are in [packages](https://github.com/tmpfs/trucks/blob/master/packages).

### Core

The [trucks-compiler][] library provides the core functionality; it bundles plugins for each compiler phase:

* [load][] Read the HTML import tree.
* [parse][] Parse the `<dom-module>` elements.
* [transform][] Run tree transformations.
* [generate][] Create output file contents.
* [write][] Write output files to disc.

### Resolvers

* [core][resolver-core] Abstract class for resolver plugins.
* [file][resolver-file] Default resolver for the `file:` protocol.
* [http][resolver-http] Resolver for the `http:` and `https:` protocols.
* [npm][resolver-npm] Resolver for the `npm:` protocol.

### Transforms

#### Compilers

* [skate][] Compiles HTML templates to render functions.

#### Preprocessors

* [less][] Preprocess less sources.
* [sass][] Preprocess sass sources.
* [stylus][] Preprocess stylus sources.
* [trim][] Trim whitespace from inline styles and scripts.

#### Styles

* [style-extract][] Write stylesheets for each component.
* [style-inject][] Read and overwrite stylesheets for each component.

#### Miscellaneous

* [csp][transform-csp] Content security policy transformations.
* [bundle][] Bundle input files with the generated output files.
* [copy][] Copy input files to the output directory.
* [tree][] Humanize the component tree using [archy][].
* [usage][] Generate component usage examples.

### Generators

* [page][generator-page] Inject output files into HTML templates.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on August 7, 2016

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
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

