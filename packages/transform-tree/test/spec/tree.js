var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('tree:', function() {

  it('should use default tree options', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'tree-default-options',
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.result.tree).to.be.an('object');
        expect(state.result.tree.node).to.be.an('object');
        expect(state.result.tree.toString).to.be.a('function');
        expect(state.result.tree.toString()).to.be.a('string');

        done();
      }
    );
  });

});
