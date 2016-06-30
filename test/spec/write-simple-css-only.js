var expect = require('chai').expect
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should write css output', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , css = 'target/simple.css';
    trucks(
      {
        files: [src],
        css: css
      },
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        expect(result.files).to.be.an('object');
        expect(result.files.css.file).to.eql(css);
        done();
      }
    );
  });

});
