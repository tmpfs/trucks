function doc(mk) {
  return function(src, dest, opts, cb) {
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
}

module.exports = doc;
