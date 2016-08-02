var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('copy:', function() {

  it('should handle enoent error', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'copy-enoent',
        transforms: [require('../../src')],
        copy: {
          files: {
            'test/fixtures/non-existent.js': 'app.js'
          }
        }
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/ENOENT/);
        done();
      }
    );
  });

});
