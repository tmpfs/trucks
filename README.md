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
- [API](#api)
  - [trucks](#trucks)
- [License](#license)

---

## Usage

Programmatic usage:

```javascript
var trucks = require('../../lib/index');

trucks({files: ['test/fixtures/components.html']}, (err, res) => {
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

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on June 29, 2016

[skatejs]: https://github.com/skatejs/skatejs
[jshint]: http://jshint.com
[jscs]: http://jscs.info

