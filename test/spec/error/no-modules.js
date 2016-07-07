var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('trucks:', function() {

  it('should error on no dom-module elements defined', function(done) {
    trucks(
      {
        files: [
          'test/fixtures/no-modules/components.html'
        ]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/no component modules/);
        done();
      }
    );
  });

});
