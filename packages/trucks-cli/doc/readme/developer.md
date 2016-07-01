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