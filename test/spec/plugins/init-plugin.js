var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should use init plugin', function(done) {
    const src = 'test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'init-plugin',
        plugins: [trucks.INIT]
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
