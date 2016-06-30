var expect = require('chai').expect
  , trucks = require('../../lib');

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
        html: html
      },
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');

        expect(result.files).to.be.an('object');
        expect(result.files.html.file).to.eql(html);
        expect(result.files.css.file).to.eql(css);
        expect(result.files.js.file).to.eql(js);
        done();
      }
    );
  });

});
