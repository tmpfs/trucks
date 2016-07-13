var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should ignore duplicate component import (dependency)',
    function(done) {
      trucks(
        {
          files: [
            'test/fixtures/duplicate-dependency-import/components.html'
          ]
        },
        (err, state) => {
          expect(err).to.eql(null);

          expect(state.result.templates).to.be.an('array').to.have.length(1);
          expect(state.result.styles).to.be.an('array').to.have.length(1);
          expect(state.result.scripts).to.be.an('array').to.have.length(1);

          done();
        }
      );
    }
  );
});
