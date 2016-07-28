module.exports = {
  files: ['doc/example/components.html'],
  transforms: ['trim', 'csp', 'skate/src', 'bundle'],
  out: 'doc/example/build',
  force: true,
  conf: {
    transforms: {
      csp: {
        sha: 'sha256',
        statics: true 
      },
      bundle: {
        js: ['node_modules/skatejs/dist/index-with-deps.js']
      }
    }
  }
}
