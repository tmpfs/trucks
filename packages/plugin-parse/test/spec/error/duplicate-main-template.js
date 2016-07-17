var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('parse:', function() {

  it('should error on multiple templates', function(done) {
    trucks(
      {
        files: [
          '../../test/fixtures/multiple-templates/components.html'
        ],
        plugins: [trucks.LOAD, require('../../../src')]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/duplicate main template/);
        done();
      }
    );
  });

});
