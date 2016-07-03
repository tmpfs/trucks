var expect = require('chai').expect
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should ignore unknown callee expresion', function(done) {
    const src = 'test/fixtures/unknown-callee/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'unknown-callee',
        babel: {plugins: []}
      },
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');

        // NOTE: not too much to assert here, this spec
        // NOTE: triggers some code paths
        // NOTE: but check that the unknown callee expression (function call)
        // NOTE: is preserved in the result javascript
        expect(/foo\(\);/m.test(result.javascript)).to.eql(true);

        done();
      }
    );
  });

});
