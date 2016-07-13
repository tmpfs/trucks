var expect = require('chai').expect
  , trucks = require('../../../src');

describe('transform:', function() {

  it('should error on invalid javascript (syntax error)', function(done) {
    trucks.transform(
      {
        result: {
          scripts: [
            {
              file: 'mock.js',
              contents: 'var foo ='
            }
          ],
          templates: []
        }
      },
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
