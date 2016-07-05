var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('trucks:', function() {

  it('should error on load with cyclic dependency (deep)',
    function(done) {
      trucks(
        {
          files: ['test/fixtures/cyclic-deep/components.html']
        },
        (err) => {
          function fn() {
            throw err;
          }
          expect(fn).throws(/cyclic dependency detected/);
          done();
        }
      );
    }
  );

});
