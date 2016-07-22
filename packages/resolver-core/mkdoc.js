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

mk.task(readme);
mk.task([readme], docs)
