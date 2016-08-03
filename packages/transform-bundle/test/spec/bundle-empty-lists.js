var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('bundle:', function() {

  it('should handle empty lists', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'bundle-empty-lists',
        transforms: [require('../../src')],
        bundle: {
          before: {
            css: null
          },
          after: {
            css: []
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
