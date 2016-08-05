var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('parse:', function() {

  it('should error on unknown protocol', function(done) {
    trucks(
      {
        files: [
          'test/fixtures/unknown-protocol/components.html'
        ],
        plugins: [trucks.LOAD, require('../../../src')]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/no resolver registered/);
        done();
      }
    );
  });

});
