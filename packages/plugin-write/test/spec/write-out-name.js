var expect = require('chai').expect
  , path = require('path')
  , trucks = require('trucks-compiler');

describe('write:', function() {

  it('should write output files w/ out option', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target'
      , name = 'mock-components'
      // names for assertions
      , css = 'target/mock-components.css'
      , js = 'target/mock-components.js'
      , html = 'target/mock-components.html';
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
        name: name,
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

  it('should write output files w/ out option and default name',
    function(done) {
      const src = '../../test/fixtures/simple-inline/components.html'
        , out = 'target'
        // names for assertions
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
          force: true,
          out: out,
          name: null,
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
    }
  );

});
