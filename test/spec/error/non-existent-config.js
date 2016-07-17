var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should error with non-existent config file', function(done) {
    trucks(
      {
        rc: ['non-existent-config.js']
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(Error);
        done();
      }
    );
  });

});
