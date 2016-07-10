var expect = require('chai').expect
  , trucks = require('../../lib');

describe('generate:', function() {

  it('should handle no options', function(done) {
    trucks.generate(
      {
        result: {
          transform: {
            css: [],
            js: [],
            tpl: []
          }
        }
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
