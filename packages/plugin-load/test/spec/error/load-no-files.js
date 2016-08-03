var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('load:', function() {

  it('should error with no input files', function(done) {
    trucks(null, (err) => {
      function fn() {
        throw err;
      }
      expect(fn).throws(/no input files/);
      done();
    });
  });

});
