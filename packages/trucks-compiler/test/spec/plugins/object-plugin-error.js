var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should error with object missing plugin function', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'object-plugin-error',
        plugins: [
          {
            plugin: null,
            foo: 'bar'
          }
        ]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/does not define plugin function/);
        done();
      }
    );
  });

});
