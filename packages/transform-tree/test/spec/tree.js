var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('tree:', function() {

  it('should use default tree options', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'tree',
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.result.tree).to.be.an('object');
        expect(state.result.tree.node).to.be.an('object');
        expect(state.result.tree.toString).to.be.a('function');
        expect(state.result.tree.toString()).to.be.a('string');

        const tree = state.result.tree.node;
        expect(tree.nodes.length).to.eql(1);

        let file = tree.nodes[0];
        expect(file.nodes.length).to.eql(1);
        file = file.nodes[0];
        expect(file.nodes.length).to.eql(1);

        const mod = file.nodes[0];
        expect(mod.nodes.length).to.eql(4);

        done();
      }
    );
  });

});
