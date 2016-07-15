var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should use load and parse plugins', function(done) {
    const src = 'test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'load-parse-plugin',
        plugins: [trucks.LOAD, trucks.PARSE]
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        expect(state.options).to.be.an('object');
        expect(state.tree).to.be.an('object');
        done();
      }
    );
  });

});
