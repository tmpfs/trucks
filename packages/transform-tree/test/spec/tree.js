var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('tree:', function() {

  it('should use default tree options', function(done) {
    const src = '../../test/fixtures/inline-partial/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'tree',
        transforms: [require('../../src')]
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
