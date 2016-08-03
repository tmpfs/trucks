var expect = require('chai').expect
  , path = require('path')
  , trucks = require('trucks-compiler');

describe('write:', function() {

  it('should write html output', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , html = 'target/simple-html-only.html';
    trucks(
      {
        files: [src],
        plugins: [
          trucks.SOURCES,
          trucks.TRANSFORM,
          trucks.GENERATE, 
          require('../../src')
        ],
        html: html,
        manifest: true
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.output).to.be.an('object');

        const manifest = state.manifest;

        const htmlFile = path.join(process.cwd(), html);
        expect(manifest[htmlFile].checksum).to.be.a('string');

        done();
      }
    );
  });

});
