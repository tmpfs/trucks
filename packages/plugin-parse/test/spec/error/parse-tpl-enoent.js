var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('parse:', function() {

  it('should error on non-existent template file', function(done) {
    trucks(
      {
        files: ['../../test/fixtures/error/tpl-enoent/components.html'],
        plugins: [trucks.LOAD, require('../../../src')]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/ENOENT/);
        expect(fn).throws(/non-existent.html/);
        done();
      }
    );
  });

});
