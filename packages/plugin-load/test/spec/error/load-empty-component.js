var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('load:', function() {

  it('should error on empty component file', function(done) {
    trucks(
        {
          files: ['../../test/fixtures/error/empty-component/components.html'],
          plugins: [require('../../../src')]
        },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/empty component file/);
        done();
      }
    );
  });

});
