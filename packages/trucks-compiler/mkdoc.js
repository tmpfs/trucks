var mk = require('mktask')
  , doc = require('../../tasks/doc')(mk);

// @task intro build the intro docs.
function intro(cb) {
  doc(
    'doc/intro/intro.md', 'doc/INTRO.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task compiler build the compiler file
function compiler(cb) {
  doc(
    'doc/compiler/compiler.md', 'doc/COMPILER.md',
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

mk.task(intro);
mk.task(compiler);
mk.task(readme);

mk.task([
  intro,
  compiler,
  readme
], docs);
