var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should error on invalid custom element name', function(done) {
    trucks(
      {
        files: [
          'test/fixtures/invalid-name/components.html'
        ]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/invalid custom element name/);
        done();
      }
    );
  });

});
