# Trucks (CLI)

[![Build Status](https://travis-ci.org/tmpfs/trucks.svg?v=2)](https://travis-ci.org/tmpfs/trucks)
[![npm version](http://img.shields.io/npm/v/trucks.svg?v=2)](https://npmjs.org/package/trucks)
[![Coverage Status](https://coveralls.io/repos/tmpfs/trucks/badge.svg?branch=master&service=github&v=4)](https://coveralls.io/github/tmpfs/trucks?branch=master)

> Web component compiler command line interface

Command line interface for the [trucks][] libary.

## Install

```
npm i -g trucks-cli
```

Or just for your project:

```
npm i trucks-cli --save-dev
```

---

- [Install](#install)
- [Documentation](#documentation)
- [Usage](#usage)
- [Completion](#completion)
- [Developer](#developer)
  - [Build](#build)
  - [Test](#test)
  - [Cover](#cover)
  - [Lint](#lint)
  - [Clean](#clean)
  - [Readme](#readme)
- [License](#license)

---

## Documentation

Use the `--help` or `-h` option for program help:

```
trucks -h
```

If the program is installed globally the man page will be installed:

```
man trucks
```

## Usage

To compile components to the current working directory:

```shell
trucks src/*.html
```

Will generate `components.html`, `components.css` and `components.js` in the current working directory. The output file name is `components` by default use the `--name` option to change the name of the generated files.

Use the `--out` option to specify the output directory:

```shell
trucks src/*.html -o build
```

Configuration files can be loaded and merged with the default options using the `--conf` option:

```shell
trucks src/*.html -o build --conf options.js
```

See [OPTIONS](https://github.com/tmpfs/trucks/blob/master/doc/OPTIONS.md) for the options that may be specified in configuration files.

For full cli documentation see the [man page](https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli/doc/man/trucks.1) and consult the [trucks][] readme for programmatic usage and more information.

## Completion

Completion is available for zsh. To install copy [_trucks](https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli/doc/zsh/_trucks) to a directory in `$fpath`, see the [completion docs](https://github.com/mkdoc/mkcli#completion) for more information.

## Developer

Install dependencies with `npm i` and install [mkdoc][] globally (`npm i -g mkdoc`).

### Build

To build all the command line interface files run:

```
mk cli
```

To see all available tasks run `mk --tasks`.

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

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 2, 2016

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
[npm]: https://www.npmjs.com/
[postcss]: https://github.com/postcss/postcss
[mkdoc]: https://github.com/mkdoc/mkdoc
[jshint]: http://jshint.com
[jscs]: http://jscs.info

