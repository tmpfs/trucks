var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('load:', function() {

  it('should error with unknown scheme protocol', function(done) {
    const src = 'test/fixtures/unknown-scheme.html';
  
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'load-plugin-unknown-scheme',
        plugins: [require('../../../src')]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/no resolver registered/);
        done();
      }
    );
  });

});
