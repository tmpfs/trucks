var expect = require('chai').expect
  , cli = require('../../cli/trucks');

describe('cli:', function() {

  it('should proxy enoent error', function(done) {
    const src = 'non-existent.html'
      , out = 'target';

    cli(
      [
        '--force',
        '--out=' + out,
        src
      ],
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
