var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('transform:', function() {

  it('should handle no options', function(done) {
    trucks(
      {
        files: ['../../test/fixtures/simple-inline/components.html'],
        plugins: [trucks.SOURCES, require('../../src')],
        force: true,
        out: 'target'
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
        files: ['../../test/fixtures/simple-inline/components.html'],
        plugins: [trucks.SOURCES, require('../../src')],
        force: true,
        out: 'target',
        babel: {plugins: []}
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
