var expect = require('chai').expect
  , cli = require('../../cli/trucks');

describe('trucks-cli:', function() {

  it('should write to output directory', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target';

    cli(
      [
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
