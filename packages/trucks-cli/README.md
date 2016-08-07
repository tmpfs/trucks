# Trucks (CLI)

> Web component compiler command line interface

Command line interface for the [trucks-compiler][] libary.

## Install

```
npm i -g trucks
```

Or just for your project:

```
npm i trucks --save-dev
```

---

- [Install](#install)
- [Documentation](#documentation)
- [Usage](#usage)
- [Completion](#completion)
- [Help](#help)
- [Developer](#developer)
  - [Build](#build)
  - [Readme](#readme)
  - [Test](#test)
  - [Cover](#cover)
  - [Lint](#lint)
  - [Clean](#clean)
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

To compile components pass HTML source files, for example:

```shell
trucks src/*.html
```

Which will generate `components.css`, `components.js` and `components.html` in the current working directory. Template elements in the source component files are compiled to javascript functions and prepended to `components.js`.

In this case the HTML templates are not compiled to javascript. Use this option when compiling [polymer][] components.

Change the output directory with the `--out` option:

```shell
trucks src/*.html -o build
```

The output file name is `components` by default; use the `--name` option to change the name of the generated files.

Configuration files can be loaded and merged with the default options using the `--conf` option:

```shell
trucks src/*.html -o build --conf options.js
```

See [OPTIONS](https://github.com/tmpfs/trucks/blob/master/doc/OPTIONS.md) for the options that may be specified in configuration files.

For full cli documentation see the [man page](https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli/doc/man/trucks.1) and consult the [trucks][] readme for information on creating components.

## Completion

Completion is available for zsh. To install copy [_trucks](https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli/doc/zsh/_trucks) to a directory in `$fpath`, see the [completion docs](https://github.com/mkdoc/mkcli#completion) for more information.

## Help

```
Usage: trucks [-fqvh] [--force] [--secure] [--print-imports] [--print-tree]
              [--print-manifest] [--print-stack] [--quiet] [--verbose] [--help]
              [--version] [--out <dir>] [--name <val>] [--html <file>] [--css
              <file>] [--js <file>] [--transforms <id...>] [--protocols
              <id...>] [--rc <file...>] [--extract <dir>] [--inject <dir>]
              [--manifest <file>] [files...]

  Compiles web components.

Options
  -o, --out=[dir]         Output directory (default: cwd)
  -n, --name=[val]        Name for output files (default: components)
  -m, --html=[file]       Template output file
  -s, --css=[file]        Stylesheet output file
  -j, --js=[file]         Javascript output file
  -t, --transforms=[id...] 
                          Run transform plugins
  -p, --protocols=[id...] Enable protocol resolver plugins
  -c, --rc=[file...]      Configuration files to require
  -e, --extract=[dir]     Extract shadow styles to directory
  -i, --inject=[dir]      Inject shadow styles from directory
  -a, --manifest=[file]   Write manifest to file
  -f, --force             Force overwrite existing files
  --secure                Disable the http: protocol
  --print-imports         Print the file hierarchy
  --print-tree            Print the component tree hierarchy
  --print-manifest        Print the generated files manifest
  --print-stack           Print stack trace on error
  -q, --quiet             Suppress all log levels.
  -v, --verbose           Enable all log levels.
  -h, --help              Display help and exit
  --version               Print the version and exit

trucks@1.0.20
```

## Developer

Install dependencies with `npm i` and install [mkdoc][] globally (`npm i -g mkdoc`).

### Build

To build all the command line interface files run:

```
mk cli
```

To see all available tasks run `mk --tasks`.

### Readme

To build the readme file:

```
mk readme
```

### Test

To run the test suite:

```
npm test
```

Tests are not included in the npm package you should clone the repository to run the test suite.

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
[standalone-manual]: https://github.com/tmpfs/trucks/blob/master/manual/standalone.md
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

