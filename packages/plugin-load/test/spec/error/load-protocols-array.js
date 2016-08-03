var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('load:', function() {

  it('should error with bad protocols array', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'load-plugin-bad-protocols-array',
        plugins: [require('../../../src')],
        conf: {
          plugins: {
            load: {
              protocols: 'foo'
            }
          }
        }
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/protocols array expected/);
        done();
      }
    );
  });

});
