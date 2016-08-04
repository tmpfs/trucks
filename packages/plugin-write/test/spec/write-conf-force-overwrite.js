var expect = require('chai').expect
  , path = require('path')
  , fs = require('fs')
  , trucks = require('trucks-compiler');

describe('write:', function() {

  it('should force overwrite output files', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
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
        plugins: [
          trucks.SOURCES,
          trucks.TRANSFORM,
          trucks.GENERATE, 
          require('../../src')
        ],
        css: css,
        js: js,
        html: html,
        write: {
          force: true,
          manifest: true
        }
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.output).to.be.an('object');

        const htmlFile = path.join(process.cwd(), html)
            , cssFile = path.join(process.cwd(), css)
            , jsFile = path.join(process.cwd(), js);

        const manifest = state.manifest;

        expect(manifest[htmlFile].checksum).to.be.a('string');
        expect(manifest[cssFile].checksum).to.be.a('string');
        expect(manifest[jsFile].checksum).to.be.a('string');

        done();
      }
    );
  });

});
