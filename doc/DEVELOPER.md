## Developer

Install dependencies and build the source files `npm i && npm run build` from [src](https://github.com/tmpfs/trucks/blob/master/src) to [lib](https://github.com/tmpfs/trucks/blob/master/lib).

To build the documentation [mkdoc][] is required (`npm i -g mkdoc`).

---

- [Developer](#developer)
  - [Build](#build)
  - [Test](#test)
  - [Cover](#cover)
  - [Lint](#lint)
  - [Clean](#clean)
  - [Docs](#docs)
  - [Readme](#readme)
  - [API](#api)
  - [Options](#options)
  - [Developer](#developer-1)
  - [Compiler](#compiler)

---

### Build

Convert the ES6 sources:

```
npm run build
```

Build all packages:

```
mk build
```

Build everything:

```
npm run build && mk build
```

### Test

To run the test suite:

```
npm test
```

Tests are not included in the npm package you should clone the repository to run the test suite.

To run all test suites:

```
npm run test && mk test
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

### Docs

To build all documentation files:

```
mk docs
```

### Readme

To build the readme file:

```
mk readme
```

### API

To build the API doc:

```
mk api
```

### Options

To build the options doc:

```
mk options
```

### Developer

To build the developer doc:

```
mk developer
```

### Compiler

To build the compiler doc:

```
mk compiler
```

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 19, 2016

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

