var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('generate:', function() {

  it('should handle no options', function(done) {
    trucks(
      {
        files: ['../../test/fixtures/simple-inline/components.html'],
        plugins: [trucks.SOURCES, trucks.TRANSFORM, require('../../src')],
        force: true,
        out: 'target'
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
