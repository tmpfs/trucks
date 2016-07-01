## Developer

Install dependencies and build the source files `npm i && npm run build` from [src](/src) to [lib](/lib).

To build the documentation [mkdoc][] is required (`npm i -g mkdoc`).

***
<!-- @toc -->
***

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

### Readme

To build the readme file:

```
mk readme
```

### Developer

To build the developer docs:

```
mk developer
```

### Compiler

To build the compiler docs:

```
mk compiler
```

### API

To build the API docs:

```
npm run api
```