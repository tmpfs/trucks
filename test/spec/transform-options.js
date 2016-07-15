var expect = require('chai').expect
  , trucks = require('../../src');

describe('transform:', function() {

  it('should handle no options', function(done) {
    trucks(
      {
        files: ['test/fixtures/simple-inline/components.html']
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

  it('should transform with plugins option', function(done) {
    trucks(
      {
        files: ['test/fixtures/simple-inline/components.html'],
        babel: {plugins: []},
        extract: true
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
