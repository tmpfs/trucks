var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('load:', function() {

  it('should use error on nested compile pass', function(done) {
    const src = 'test/fixtures/compiler-options-error/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'load-compiler-options-error',
        plugins: [require('../../../src')]
      }, (err) => {
        function fn() {
          throw err; 
        }

        expect(fn).throws(/ENOENT/);
        done();
      }
    );
  });

});
