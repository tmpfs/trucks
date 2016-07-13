var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should write css output', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , css = 'target/simple-css-only.css';
    trucks(
      {
        files: [src],
        css: css
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const result = state.result.write;
        expect(result.files).to.be.an('object');
        expect(result.files.css.file).to.eql(css);
        done();
      }
    );
  });

});
