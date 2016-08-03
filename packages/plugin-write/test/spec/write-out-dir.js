var expect = require('chai').expect
  , path = require('path')
  , trucks = require('trucks-compiler');

describe('write:', function() {

  it('should write output files w/ out option', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target'
      // default names for assertions
      , css = 'target/components.css'
      , js = 'target/components.js'
      , html = 'target/components.html';
    trucks(
      {
        files: [src],
        plugins: [
          trucks.SOURCES,
          trucks.TRANSFORM,
          trucks.GENERATE, 
          require('../../src')
        ],
        out: out,
        force: true,
        manifest: true
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
