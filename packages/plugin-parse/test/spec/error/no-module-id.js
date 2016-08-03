var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('parse:', function() {

  it('should error on no dom-module missing id attribute', function(done) {
    trucks(
      {
        files: [
          '../../test/fixtures/no-module-id/components.html'
        ],
        plugins: [trucks.LOAD, require('../../../src')]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/identifier missing for component module/);
        done();
      }
    );
  });

});
