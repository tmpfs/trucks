module.exports = {
  files: ['doc/example/components.html'],
  transforms: ['trim', 'skate'],
  out: 'doc/example/build',
  force: true,
  compiler: {
    literals: true
  }
}
