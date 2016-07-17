var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('parse:', function() {

  it('should error on duplicate template identifier (multiple source files)', 
    function(done) {
      trucks(
        {
          files: [
            '../../test/fixtures/duplicate-multiple-id/component-a.html',
            '../../test/fixtures/duplicate-multiple-id/component-b.html'
          ],
          plugins: [trucks.LOAD, require('../../../src')]
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
