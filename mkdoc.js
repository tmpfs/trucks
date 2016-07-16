var mk = require('mktask');

// @task api build the api docs.
function api(cb) {
  // build intermediary file
  const exec = require('child_process').execSync;
  exec(
    'mkapi src/index.js --level=3 '
      + '> doc/api/api-docs.md');

  // build api docs with toc
  mk.doc('doc/api/api.md')
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.toc({depth: 2}))
    .pipe(mk.out())
    .pipe(mk.dest('doc/API.md'))
    .on('finish', cb);
}

// @task options build the options file
function options(cb) {
  mk.doc('doc/options/options.md')
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.toc({depth: 2, max: 3}))
    .pipe(mk.out())
    .pipe(mk.dest('doc/OPTIONS.md'))
    .on('finish', cb);
}

// @task developer build the developer file
function developer(cb) {
  mk.doc('doc/developer/developer.md')
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.toc({depth: 2, max: 3}))
    .pipe(mk.out())
    .pipe(mk.dest('doc/DEVELOPER.md'))
    .on('finish', cb);
}

// @task compiler build the compiler file
function compiler(cb) {
  mk.doc('doc/compiler/compiler.md')
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.toc({depth: 2, max: 3}))
    .pipe(mk.out())
    .pipe(mk.dest('doc/COMPILER.md'))
    .on('finish', cb);
}

// @task exmaple build the example file
function example(cb) {
  mk.doc('doc/example/example.md')
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.toc({depth: 2, max: 3}))
    .pipe(mk.out())
    .pipe(mk.dest('doc/EXAMPLE.md'))
    .on('finish', cb);
}

// @task readme build the readme file
function readme(cb) {
  mk.doc('doc/readme.md')
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.toc({depth: 2, max: 3}))
    //.pipe(mk.ast.stringify())
    //.pipe(process.stdout)
    .pipe(mk.out())
    .pipe(mk.dest('README.md'))
    .on('finish', cb);
}

// @task docs build all docs
function docs(cb){
  cb();
}

mk.task(api);
mk.task(options);
mk.task(developer);
mk.task(compiler);
mk.task(example);
mk.task(readme);
mk.task([api, options, developer, compiler, example, readme], docs)
