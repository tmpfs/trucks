var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('load:', function() {

  it('should error on load with cyclic dependency (child)', function(done) {
    trucks(
      {
        files: ['../../test/fixtures/cyclic-child/components.html'],
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
  });

});
