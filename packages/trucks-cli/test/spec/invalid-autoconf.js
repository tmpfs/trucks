var expect = require('chai').expect
  , cli = require('../../cli/trucks');

describe('cli:', function() {
  let owd;

  before((done) => {
    owd = process.cwd();
    process.chdir('test/fixtures/invalid-autoconf');
    done(); 
  })

  after((done) => {
    process.chdir(owd);
    done(); 
  })

  it('should ignore invalid trucks.js from cwd', function(done) {
    const out = 'target';

    cli(
      [
        '--force',
        '--out=' + out
      ],
      (err) => {
        function fn() {
          throw err;
        }
        // `no input files` but relaxed assertion
        expect(fn).throws(Error);
        done();
      }
    );
  });

});
