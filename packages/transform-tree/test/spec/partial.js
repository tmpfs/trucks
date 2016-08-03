var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('tree:', function() {

  it('should include template partials', function(done) {
    const src = '../../test/fixtures/inline-partial/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'tree-partial',
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
