var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('trucks:', function() {

  it('should error on duplicate template identifier (multiple source files)', 
    function(done) {
      trucks(
        {
          files: [
            'test/fixtures/duplicate-multiple-id/component-a.html',
            'test/fixtures/duplicate-multiple-id/component-b.html'
          ]
        },
        (err) => {
          function fn() {
            throw err;
          }
          expect(fn).throws(/duplicate template identifier/);
          done();
        }
      );
    }
  );

});
