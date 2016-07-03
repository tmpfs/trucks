var expect = require('chai').expect
  , trucks = require('../../lib');

describe('transform:', function() {

  it('should handle no options', function(done) {
    trucks.transform(
      {
        js: []
      },
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

  it('should transform with plugins option', function(done) {
    trucks.transform(
      {
        js: [{contents: 'skate.define("x-foo", {});var foo = bar();'}]
      },
      {babel: {plugins: []}, extract: true},
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
