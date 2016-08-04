module.exports = {
  files: [__dirname + '/components.html'],
  transforms: ['trim', 'csp', 'skate', 'bundle', 'usage'],
  generators: ['page'],
  out: 'build',
  force: true,
  css: false,
  html: false,
  page: {
    files: {
      'template.html': 'index.html'
    } 
  },
  write: {
    exclude: /\.?usage.html$/
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
