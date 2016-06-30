var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('transform:', function() {

  it('should error on invalid javascript (syntax error)', function(done) {
    trucks.transform(
      {js: [{file: 'mock.js',contents: 'var foo ='}]},
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(Error);
        expect(fn).throws(/mock.js/);
        done();
      }
    );
  });

});
