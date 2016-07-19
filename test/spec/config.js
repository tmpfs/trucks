var expect = require('chai').expect
  , fs = require('fs')
  , path = require('path')
  , trucks = require('../../src');

function assert(state) {
  expect(state).to.be.an('object');

  expect(state.options.name).to.eql('mock-config');

  var stat = fs.statSync('target/mock-config.html');
  expect(stat).to.be.an('object');
  expect(stat.isFile()).to.eql(true);
  expect(stat.size).to.be.gt(0);

  stat = fs.statSync('target/mock-config.css');
  expect(stat).to.be.an('object');
  expect(stat.isFile()).to.eql(true);
  expect(stat.size).to.be.gt(0);

  stat = fs.statSync('target/mock-config.js');
  expect(stat).to.be.an('object');
  expect(stat.isFile()).to.eql(true);
  expect(stat.size).to.be.gt(0);
}

describe('trucks:', function() {

  it('should merge relative config file', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , out = 'target';
    trucks(
      {
        files: [src],
        out: out,
        rc: ['test/fixtures/mock-config.js'],
        transforms: ['skate/src']
      },
      (err, state) => {
        expect(err).to.eql(null);
        assert(state);

        done();
      }
    );
  });

  it('should merge absolute config file', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , out = 'target';
    trucks(
      {
        files: [src],
        out: out,
        force: true,
        rc: path.join(process.cwd(), 'test/fixtures/mock-config.js'),
        transforms: ['skate/src']
      },
      (err, state) => {
        expect(err).to.eql(null);
        assert(state);
        done();
      }
    );
  });

});
