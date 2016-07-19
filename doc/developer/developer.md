## Developer

Install dependencies and build the source files `npm i && npm run build` from [src](/src) to [lib](/lib).

To build the documentation [mkdoc][] is required (`npm i -g mkdoc`).

***
<!-- @toc -->
***

### Build

Build all packages:

```
mk build
```

Convert the ES6 sources for this package:

```
npm run build
```

### Test

To run all test suites:

```
mk test
```

To run the test suite for the core library:

```
npm test
```

Tests are not included in the npm package you should clone the repository to run the test suite.

### Cover

To generate coverage for all packages:

```
mk cover
```

To generate code coverage for the core library:

```
npm run cover
```

### Lint

To lint all packages:

```
mk lint
```

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

<? @include ../readme/links.md ?>
