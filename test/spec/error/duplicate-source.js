var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('trucks:', function() {

  it('should error on duplicate input source file', function(done) {
    trucks(
      {
        // NOTE: trigger error by duplicating the input source file path
        files: [
          'test/fixtures/duplicate-source/components.html',
          'test/fixtures/duplicate-source/components.html'
        ]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/duplicate component source file/);
        done();
      }
    );
  });

});
