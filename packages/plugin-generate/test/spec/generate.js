var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('generate:', function() {

  it('should use default generate options', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'generate',
        plugins: [trucks.SOURCES, trucks.TRANSFORM, require('../../src')]
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
