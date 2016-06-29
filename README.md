# Trucks

[![Build Status](https://travis-ci.org/tmpfs/trucks.svg?v=2)](https://travis-ci.org/tmpfs/trucks)
[![npm version](http://img.shields.io/npm/v/trucks.svg?v=2)](https://npmjs.org/package/trucks)
[![Coverage Status](https://coveralls.io/repos/tmpfs/trucks/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/tmpfs/trucks?branch=master)

> Skatejs compiler and component manager

Compiles [skatejs][] components declared as HTML to javascript and css files.

## Install

```
npm i -g trucks
```

---

- [Install](#install)
- [Usage](#usage)
- [Compiler](#compiler)
- [API](#api)
  - [trucks](#trucks)
- [Developer](#developer)
  - [Build](#build)
  - [Test](#test)
  - [Cover](#cover)
  - [Lint](#lint)
  - [Clean](#clean)
  - [Readme](#readme)
- [License](#license)

---

## Usage

Programmatic usage:

```javascript
var trucks = require('../../lib/index');

trucks({files: ['example/components.html']}, (err, res) => {
  if(err) {
    throw err; 
  }
  console.log(res);
});
```

The equivalent command line:

```shell
trucks test/fixtures/components.html
```

## Compiler

The compiler executes the following phases:

* `load`: Load all source HTML files given with the `files` option and resolve the HTML imports.
* `parse`: Parse the imported files resolving inline and external styles and javascript.
* `transform`: Transform the imported component files compiling `<template>` elements to javascript.
* `generate`: Convert the transformed components to css and javascript strings.
* `write`: Write the generated code to disc.
## API

### trucks

```javascript
trucks((Object), cb)
```

Compile component HTML files to CSS and Javascript.

* `(Object)` opts processing options.
* `cb` Function callback function.

#### Options

* `files` Array list of HTML files to compile.

## Developer

Install dependencies and build the source files `npm i && npm run build` from [src](https://github.com/tmpfs/trucks/blob/master/src) to [lib](https://github.com/tmpfs/trucks/blob/master/lib).

### Build

Convert the ES6 sources to ES2015:

```
npm run build
```

### Test

To run the test suite:

```
npm test
```

### Cover

To generate code coverage run:

```
npm run cover
```

### Lint

Run the source tree through [jshint][] and [jscs][]:

```
npm run lint
```

### Clean

Remove generated files:

```
npm run clean
```

### Readme

To build the readme file [mkdoc][] is required (`npm i -g mkdoc`):

```
mk readme
```

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on June 29, 2016

[skatejs]: https://github.com/skatejs/skatejs
[mkdoc]: https://github.com/mkdoc/mkdoc
[jshint]: http://jshint.com
[jscs]: http://jscs.info

