var expect = require('chai').expect
  , trucks = require('../../src');

describe('transform:', function() {

  it('should handle no options', function(done) {
    trucks.transform(
      {
        result: {
          templates: [],
          scripts: []
        }
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

  it('should transform with plugins option', function(done) {
    trucks.transform(
      {
        options: {babel: {plugins: []}, extract: true},
        result: {
          templates: [],
          scripts: [{contents: 'skate.define("x-foo", {});var foo = bar();'}]
        }
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
