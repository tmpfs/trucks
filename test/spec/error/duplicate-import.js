var expect = require('chai').expect
  , trucks = require('../../../lib');

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
        (err, result) => {
          expect(err).to.eql(null);

          expect(result.tpl).to.be.an('array').to.have.length(1);
          expect(result.css).to.be.an('array').to.have.length(1);
          expect(result.js).to.be.an('array').to.have.length(1);

          done();
        }
      );
    }
  );
});
