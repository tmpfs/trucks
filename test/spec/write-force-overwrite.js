var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should force overwrite output files', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , css = 'target/simple-force.css'
      , js = 'target/simple-force.js'
      , html = 'target/simple-force.html';

    // mock existing files
    fs.writeFileSync(css, '');
    fs.writeFileSync(js, '');
    fs.writeFileSync(html, '');

    trucks(
      {
        files: [src],
        css: css,
        js: js,
        html: html,
        extract: true,
        force: true
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
