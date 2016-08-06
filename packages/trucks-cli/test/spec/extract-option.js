var expect = require('chai').expect
  , cli = require('../../cli/trucks');

describe('cli:', function() {

  it('should use extract option', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target';

    cli(
      [
        '--force',
        '--extract=' + out,
        '--out=' + out,
        src
      ],
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

  it('should use extract option defer to --out', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target';

    cli(
      [
        '--force',
        '--extract=',
        '--out=' + out,
        src
      ],
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
