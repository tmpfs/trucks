var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('trucks:', function() {

  it('should error on duplicate template identifier', function(done) {
    trucks(
      {
        files: ['test/fixtures/duplicate-id/components.html']
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/duplicate template identifier/);
        done();
      }
    );
  });

});
