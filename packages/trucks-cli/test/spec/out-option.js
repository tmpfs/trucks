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
      (err, result) => {
        expect(err).to.eql(null);

        expect(result.files).to.be.an('object');
        expect(result.files.html.file).to.be.eql('target/components.html');
        expect(result.files.css.file).to.be.eql('target/components.css');
        expect(result.files.js.file).to.be.eql('target/components.js');

        done();
      }
    );
  });

});
