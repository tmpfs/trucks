var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('load:', function() {

  it('should ignore duplicate component import (dependency)',
    function(done) {
      trucks(
        {
          files: [
            '../../test/fixtures/duplicate-dependency-import/components.html'
          ],
          plugins: [require('../../src'), trucks.PARSE],
          force: true,
          out: 'target'
        },
        (err, state) => {
          expect(err).to.eql(null);

          expect(state.result.templates).to.be.an('array').to.have.length(1);
          expect(state.tree.getStyles()).to.be.an('array').to.have.length(1);
          expect(state.result.scripts).to.be.an('array').to.have.length(1);

          done();
        }
      );
    }
  );
});
