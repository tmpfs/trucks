var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('parse:', function() {

  it('should use default parse options', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'parse',
        plugins: [trucks.LOAD, require('../../src')]
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
