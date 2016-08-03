var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('page:', function() {

  it('should handle enoent error', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        force: true,
        generators: [require('../../src')],
        page: {
          files: {
            'test/fixtures/non-existent.html': 'non-existent.html'
          }
        }
      }, (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/ENOENT/);
        done();
      }
    );
  });

});
