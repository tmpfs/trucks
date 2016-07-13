var expect = require('chai').expect
  , trucks = require('../../../src');

describe('load:', function() {

  it('should error on load with no options', function(done) {
    trucks(
      null,
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/no input files/);
        done();
      }
    );
  });

  it('should error on load with non-existent file', function(done) {
    trucks(
        {files: ['non-existent/components.html']},
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
