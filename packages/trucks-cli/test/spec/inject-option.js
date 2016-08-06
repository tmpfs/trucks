var expect = require('chai').expect
  , cli = require('../../cli/trucks');

describe('cli:', function() {

  it('should use inject option', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target';

    cli(
      [
        '--force',
        '--inject=' + out,
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

  it('should use inject option defer to --out', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target';

    cli(
      [
        '--force',
        '--inject=',
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
