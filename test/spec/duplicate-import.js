var expect = require('chai').expect
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should ignore duplicate component import (multiple files)',
    function(done) {
      trucks(
        {
          files: [
            'test/fixtures/duplicate-import/components.html',
            'test/fixtures/duplicate-import/components-alt.html'
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
