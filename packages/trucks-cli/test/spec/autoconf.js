var expect = require('chai').expect
  , cli = require('../../cli/trucks');

describe('cli:', function() {
  let owd;

  before((done) => {
    owd = process.cwd();
    process.chdir('test/fixtures/autoconf');
    done(); 
  })

  after((done) => {
    process.chdir(owd);
    done(); 
  })

  it('should use trucks.js from cwd', function(done) {
    const out = 'target';

    cli(
      [
        '--force',
        '--out=' + out
      ],
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
