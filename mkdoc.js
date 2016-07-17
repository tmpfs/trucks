var mk = require('mktask');

function doc(src, dest, opts, cb) {
  mk.doc(src)
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.toc(opts.toc))
    //.pipe(mk.ast.stringify())
    //.pipe(process.stdout)
    .pipe(mk.out())
    .pipe(mk.dest(dest))
    .on('finish', cb);
}

// @task api build the api docs.
function api(cb) {
  // build intermediary file
  const exec = require('child_process').execSync;
  exec(
    'mkapi src/index.js --level=3 '
      + '> doc/api/api-docs.md');

  // build the docs
  doc('doc/api/api.md', 'doc/API.md', {toc: {depth: 2}}, cb);
}

// @task roadmap build the roadmap file
function roadmap(cb) {
  doc(
    'doc/roadmap/roadmap.md', 'doc/ROADMAP.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task options build the options file
function options(cb) {
  doc(
    'doc/options/options.md', 'doc/OPTIONS.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task developer build the developer file
function developer(cb) {
  doc(
    'doc/developer/developer.md', 'doc/DEVELOPER.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task compiler build the compiler file
function compiler(cb) {
  doc(
    'doc/compiler/compiler.md', 'doc/COMPILER.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task exmaple build the example file
function example(cb) {
  doc(
    'doc/example/example.md', 'doc/EXAMPLE.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task readme build the readme file
function readme(cb) {
  doc(
    'doc/readme.md', 'README.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task docs build all docs
function docs(cb){
  cb();
}

mk.task(api);
mk.task(roadmap);
mk.task(options);
mk.task(developer);
mk.task(compiler);
mk.task(example);
mk.task(readme);
mk.task([api, roadmap, options, developer, compiler, example, readme], docs)
