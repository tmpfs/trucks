var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('parse:', function() {

  it('should error on non-existent js file', function(done) {
    trucks(
        {files: ['test/fixtures/error/js-enoent/components.html']},
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/ENOENT/);
        expect(fn).throws(/non-existent.js/);
        done();
      }
    );
  });

});
