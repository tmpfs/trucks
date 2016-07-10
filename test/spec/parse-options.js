var expect = require('chai').expect
  , trucks = require('../../lib');

describe('parse:', function() {

  it('should handle no options', function(done) {
    trucks.parse(
      {
        result: {
          load: {
            files: []
          }
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
