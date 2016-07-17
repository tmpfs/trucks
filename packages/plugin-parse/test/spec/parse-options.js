var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('parse:', function() {

  it('should handle no options', function(done) {
    trucks(
      {
        files: ['../../test/fixtures/simple-inline/components.html'],
        plugins: [trucks.LOAD, require('../../src'), trucks.TRANSFORM],
        force: true,
        out: 'target'
      },
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
