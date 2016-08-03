var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('parse:', function() {

  it('should parse without template element', function(done) {
    const src = '../../test/fixtures/no-template/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'parse-no-template',
        plugins: [trucks.LOAD, require('../../src')]
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
