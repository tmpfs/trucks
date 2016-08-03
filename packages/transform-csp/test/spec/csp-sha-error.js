var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('csp:', function() {

  it('should error on bad sha option', function(done) {
    const src = '../../test/fixtures/component-style/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'csp-sha-error',
        force: true,
        transforms: [require('../../src'), 'skate/src'],
        conf: {
          transforms: {
            csp: {
              sha: 'foo'
            }
          }
        }
      }, (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/invalid sha/);

        done();
      }
    );
  });

});
