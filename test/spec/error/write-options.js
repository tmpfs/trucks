var expect = require('chai').expect
  , trucks = require('../../../src');

describe('write:', function() {

  it('should error on write with non-existent path', function(done) {
    trucks(
      {
        files: ['test/fixtures/simple-inline/components.html'],
        css: 'non-existent/error.css'
        //result: {},
        //output: {
          //'non-existent/errors.css': 'x-component{}'
        //}
      },
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
