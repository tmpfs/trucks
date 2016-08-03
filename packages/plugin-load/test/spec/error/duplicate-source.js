var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('load:', function() {

  it('should error on duplicate input source file', function(done) {
    trucks(
      {
        // NOTE: trigger error by duplicating the input source file path
        files: [
          '../../test/fixtures/duplicate-source/components.html',
          '../../test/fixtures/duplicate-source/components.html'
        ],
        plugins: [require('../../../src')]
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
