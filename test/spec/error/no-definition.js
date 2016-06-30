var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('transform:', function() {

  it('should error with no component definition', function(done) {
    trucks(
      {files: ['test/fixtures/error/no-definition/components.html']},
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/does not define a component/);
        done();
      }
    );
  });

});
