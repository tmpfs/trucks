var expect = require('chai').expect
  , trucks = require('../..');

describe('trucks:', function() {

  it('should error with no input files', function(done) {
    trucks({}, (err) => {
      function fn() {
        throw err;
      }
      expect(fn).throws(/no input files/);
      done();
    });
  });

});
