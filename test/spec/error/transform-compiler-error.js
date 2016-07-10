var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('transform:', function() {

  it('should error on invalid javascript (syntax error)', function(done) {
    trucks.transform(
      {
        result: {
          parse: {
            js: [
              {
                file: 'mock.js',
                contents: 'var foo ='
              }
            ],
            tpl: []
          }
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
