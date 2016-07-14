var expect = require('chai').expect
  , trucks = require('../../src');

describe('parse:', function() {

  it('should handle no options', function(done) {
    trucks.parse(
      {
        result: {
          files: [],
          templates: []
        }
      },
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
