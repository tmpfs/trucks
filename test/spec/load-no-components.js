var expect = require('chai').expect
  , trucks = require('../../lib');

describe('load:', function() {

  it('should error with no component imports', function(done) {
    trucks({files: ['test/fixtures/empty-components.html']}, (err) => {
      function fn() {
        throw err;
      }
      expect(fn).throws(/does not import components/);
      done();
    });
  });

});
