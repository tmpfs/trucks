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
    'mkapi src/index.js src/state.js src/component.js  --level=3 '
      + '> doc/api/api-docs.md');

  // build the docs
  doc('doc/api/api.md', 'doc/API.md', {toc: {depth: 2}}, cb);
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
mk.task(readme);

mk.task([
  api,
  readme
], docs);
