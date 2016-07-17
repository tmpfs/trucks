var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('transform:', function() {

  it('should error with bad visitors array', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'transform-plugin-bad-visitors-array',
        plugins: [
          trucks.SOURCES, 
          trucks.GENERATE, 
          require('../../../src')
        ],
        conf: {
          plugins: {
            transform: {
              visitors: 'foo'
            }
          }
        }
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/transform visitors array expected/);
        done();
      }
    );
  });

});
