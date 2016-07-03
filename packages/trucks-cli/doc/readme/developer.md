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

