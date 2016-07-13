var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should error on load with cyclic dependency (child)', function(done) {
    trucks(
      {
        files: ['test/fixtures/cyclic-child/components.html']
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
