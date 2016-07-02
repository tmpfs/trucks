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

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 2, 2016

