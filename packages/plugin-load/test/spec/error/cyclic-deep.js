var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('load:', function() {

  it('should error on load with cyclic dependency (deep)',
    function(done) {
      trucks(
        {
          files: ['../../test/fixtures/cyclic-deep/components.html'],
          plugins: [require('../../../src')]
        },
        (err) => {
          function fn() {
            throw err;
          }
          expect(fn).throws(/cyclic dependency detected/);
          done();
        }
      );
    }
  );

});
