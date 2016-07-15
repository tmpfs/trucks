var expect = require('chai').expect
  , trucks = require('../../../src');

describe('transform:', function() {

  it('should error on invalid javascript (syntax error)', function(done) {
    trucks(
      {
        files: ['test/fixtures/syntax-error.html']
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(Error);
        expect(fn).throws(/unexpected token/i);
        //expect(fn).throws(/mock.js/);
        done();
      }
    );
  });

});
