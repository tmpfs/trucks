module.exports = {
  files: [__dirname + '/components.html'],
  transforms: ['trim', 'csp', 'skate', 'bundle', 'copy'],
  out: '.',
  force: true,
  css: false,
  html: false,
  copy: {
    files: {
      'index.html': 'index.html'
    } 
  },
  conf: {
    transforms: {
      csp: {
        sha: 'sha256',
        statics: true 
      },
      bundle: {
        js: [require.resolve('skatejs/dist/index-with-deps.js')]
      }
    }
  }
}
