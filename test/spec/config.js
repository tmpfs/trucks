var expect = require('chai').expect
  , fs = require('fs')
  , path = require('path')
  , trucks = require('../../lib');

function assert(result) {
  expect(result).to.be.an('object');

  expect(result.options.name).to.eql('mock-config');

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

  expect(result.files).to.be.an('object');
}

describe('trucks:', function() {

  it('should merge relative config file', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , out = 'target';
    trucks(
      {
        files: [src],
        out: out,
        conf: ['test/fixtures/mock-config.js']
      },
      (err, result) => {
        expect(err).to.eql(null);
        assert(result);
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
        conf: path.join(process.cwd(), 'test/fixtures/mock-config.js')
      },
      (err, result) => {
        expect(err).to.eql(null);
        assert(result);
        done();
      }
    );
  });

});
