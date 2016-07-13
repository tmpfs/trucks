var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should write output files', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , css = 'target/simple.css'
      , js = 'target/simple.js'
      , html = 'target/simple.html';
    trucks(
      {
        files: [src],
        css: css,
        js: js,
        html: html,
        extract: true
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const result = state.result.write;
        expect(result.files).to.be.an('object');
        expect(result.files.html.file).to.eql(html);
        expect(result.files.css.file).to.eql(css);
        expect(result.files.js.file).to.eql(js);
        done();
      }
    );
  });

});
