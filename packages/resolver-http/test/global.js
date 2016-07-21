const server = require('./server');

before((done) => {
  server(done);
})
