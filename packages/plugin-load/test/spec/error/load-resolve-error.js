var expect = require('chai').expect
  , trucks = require('trucks-compiler')
  , Resolver = require('trucks-resolver-file').Resolver;

class MockResolver extends Resolver {
  constructor() {
    super(...arguments);
  }

  resolve(cb) {
    return cb(new Error('mock error')); 
  }
}

describe('load:', function() {

  it('should proxy resolver resolve error', function(done) {
    const src = 'test/fixtures/http-scheme.html';
  
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'load-plugin-fetch-error',
        plugins: [require('../../../src')],
        conf: {
          plugins: {
            load: {
              protocols: [
                function plugin() {
                  return function(registry) {
                    registry.register('http:', MockResolver); 
                  } 
                }
              ]
            }
          }
        }
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/mock error/);
        done();
      }
    );
  });

});
