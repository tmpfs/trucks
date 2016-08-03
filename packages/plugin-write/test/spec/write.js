var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('write:', function() {

  it('should use default write options', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'write',
        plugins: [
          trucks.SOURCES,
          trucks.TRANSFORM,
          trucks.GENERATE, 
          require('../../src')
        ]
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
