var expect = require('chai').expect
  , cli = require('../../cli/trucks');

describe('cli:', function() {

  it('should split transforms option', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target';

    cli(
      [
        '--force',
        '--out=' + out,
        '--transforms=foo,bar',
        src
      ],
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/trucks-transform-foo/);
        done();
      }
    );
  });

});
