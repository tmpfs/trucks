var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('tree:', function() {

  it('should use label function option', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    
    let invoked = false;

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'tree-label',
        transforms: [require('../../src')],
        conf: {
          transforms: {
            tree: {
              label: (tag) => {
                invoked = true;
                return tag; 
              }
            }
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(invoked).to.eql(true);

        expect(state.result.tree).to.be.an('object');
        expect(state.result.tree.node).to.be.an('object');
        expect(state.result.tree.toString).to.be.a('function');
        expect(state.result.tree.toString()).to.be.a('string');

        done();
      }
    );
  });

});
