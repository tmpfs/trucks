var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('write:', function() {

  it('should error on write with non-existent path', function(done) {
    trucks.write(
      {stylesheet: 'x-component{}'},
      {css: 'non-existent/error.css'},
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/ENOENT/);
        done();
      }
    );
  });

});
