var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('parse:', function() {

  it('should error on reserved custom element name', function(done) {
    trucks(
      {
        files: [
          '../../test/fixtures/reserved-name/components.html'
        ],
        plugins: [trucks.LOAD, require('../../../src')]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/reserved custom element name/);
        done();
      }
    );
  });

});
