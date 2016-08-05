var mk = require('mktask')
  , doc = require('../../tasks/doc')(mk);

// @task api build the api docs.
function api(cb) {
  // build intermediary file
  const exec = require('child_process').execSync;
  exec(
    'mkapi src/index.js src/state.js src/component.js  --level=3 '
      + '> doc/api/api-docs.md');

  // build the docs
  doc('doc/api/api.md', 'doc/API.md', {toc: {depth: 2}}, cb);
}

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

mk.task(api);
mk.task(readme);

mk.task([
  api,
  intro,
  compiler,
  readme
], docs);
