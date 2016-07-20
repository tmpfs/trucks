var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should error on multiple templates', function(done) {
    trucks(
      {
        files: [
          'test/fixtures/multiple-templates/components.html'
        ]
      },
      (err) => {

        console.dir(err.message);
        function fn() {
          throw err;
        }
        expect(fn).throws(/duplicate main template/);
        done();
      }
    );
  });

});
