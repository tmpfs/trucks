var expect = require('chai').expect
  , trucks = require('../../src');

describe('generate:', function() {

  it('should handle no options', function(done) {
    trucks.generate(
      {
        result: {
          styles: [],
          scripts: [],
          templates: []
        }
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
