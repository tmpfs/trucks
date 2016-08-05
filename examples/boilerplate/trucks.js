const options = {
  files: [__dirname + '/components.html'],
  transforms: ['trim', 'usage'],
  generators: ['page'],
  out: 'build',
  force: true,
  html: false,
  page: {
    files: {
      'template.html': 'index.html'
    } 
  },
  write: {
    exclude: /\.?usage.html$/
  }
}

module.exports = options;
