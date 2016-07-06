var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('trucks:', function() {

  it('should error on duplicate template identifier', function(done) {
    trucks(
      {
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
