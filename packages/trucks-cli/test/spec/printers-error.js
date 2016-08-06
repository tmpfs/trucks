var expect = require('chai').expect
  , cli = require('../../cli/trucks');

describe('cli:', function() {

  it('should error on incompatible print args', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target';

    cli(
      [
        '--print-imports',
        '--print-manifest',
        '--force',
        '--out=' + out,
        src
      ],
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/incompatible printers/);
        done();
      }
    );
  });

});
