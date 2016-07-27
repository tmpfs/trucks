module.exports = {
  files: ['doc/example/components.html'],
  transforms: ['trim', 'csp', 'skate'],
  out: 'doc/example/build',
  force: true,
  conf: {
    transforms: {
      csp: {
        sha: 'sha256',
        statics: true 
      }
    }
  }
}
