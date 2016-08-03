var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('transform:', function() {

  it('should visit tree node', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    let visited = false
      , count = 0;

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'transform-plugin-tree',
        plugins: [trucks.LOAD, trucks.PARSE, require('../../../src')],
        transforms: [
          function visit() {
            return {
              'Tree': function(node, cb) {
                expect(node).to.be.an('object');
                visited = true;
                count++;
                cb(null, node);
              }
            }
          }
        ]
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(visited).to.eql(true);
        expect(count).to.eql(1);

        expect(state.options).to.be.an('object');
        expect(state.tree).to.be.an('object');
        done();
      }
    );
  });

});
