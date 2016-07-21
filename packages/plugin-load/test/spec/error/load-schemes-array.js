var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('load:', function() {

  it('should error with bad schemes array', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'load-plugin-bad-schemes-array',
        plugins: [require('../../../src')],
        conf: {
          plugins: {
            load: {
              schemes: 'foo'
            }
          }
        }
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/schemes array expected/);
        done();
      }
    );
  });

});
