## Developer

Install [mkdoc][] `npm i -g mkdoc` and then install dependencies for all packages with `mk install`.

You should now be able to use the scripts and tasks, list tasks with `mk --tasks`.

It is a good idea to run the `build` task before tests; it is recommended that before pushing code the command `mk build test` is run.

At the top-level you run the following commands for all packages:

* `mk install` Install dependencies.
* `mk test` Run tests.
* `mk cover` Run code coverage.
* `mk build` Compile sources.
* `mk lint` Lint sources.

Build a coverage report for all packages with:

```
mk cover && npm run report
```

Note that tests are not included in the npm packages you should clone the repository to run the test suites.

***
<!-- @toc -->
***

## Scripts

In the scope of a package the following scripts are available.

### Build

Convert the ES6 sources for a package:

```
npm run build
```

### Test

To run the test suite:

```
npm test
```

### Cover

To generate code coverage:

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

<? @include links.md ?>
