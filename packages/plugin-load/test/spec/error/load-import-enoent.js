var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('load:', function() {

  it('should error on load with non-existent import file', function(done) {
    trucks(
        {
          files: ['../../test/fixtures/error/import-enoent.html'],
          plugins: [require('../../../src')]
        },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/ENOENT/);
        done();
      }
    );
  });

});
