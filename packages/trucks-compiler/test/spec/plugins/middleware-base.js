var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should require relative to explicit base path', function(done) {
    const src = 'test/fixtures/middleware-base/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'middleware-base'
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
