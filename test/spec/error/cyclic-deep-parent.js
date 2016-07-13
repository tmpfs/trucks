var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should error on load with cyclic dependency (deep parent)',
    function(done) {
      trucks(
        {
          files: ['test/fixtures/cyclic-deep-parent/components.html']
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
