var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should error with invalid plugin', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'invalid-plugin',
        plugins: [null]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/invalid middleware plugin declaration/);
        done();
      }
    );
  });

});
