var expect = require('chai').expect
  , trucks = require('../../lib');

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

          const result = state.result.transform;

          expect(result.tpl).to.be.an('array').to.have.length(1);
          expect(result.css).to.be.an('array').to.have.length(1);
          expect(result.js).to.be.an('array').to.have.length(1);

          done();
        }
      );
    }
  );
});
