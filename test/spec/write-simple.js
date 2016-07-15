var expect = require('chai').expect
  , path = require('path')
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

        expect(state.output).to.be.an('object');

        const htmlFile = path.join(process.cwd(), html)
            , cssFile = path.join(process.cwd(), css)
            , jsFile = path.join(process.cwd(), js);

        expect(state.output[htmlFile].name).to.eql(html);
        expect(state.output[htmlFile].result.file).to.be.a('string');
        expect(state.output[cssFile].name).to.eql(css);
        expect(state.output[cssFile].result.file).to.be.a('string');
        expect(state.output[jsFile].name).to.eql(js);
        expect(state.output[jsFile].result.file).to.be.a('string');
        done();
      }
    );
  });

});
