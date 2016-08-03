var expect = require('chai').expect
  , path = require('path')
  , trucks = require('trucks-compiler');

describe('write:', function() {

  it('should write js output', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , js = 'target/simple-js-only.js';
    trucks(
      {
        files: [src],
        plugins: [
          trucks.SOURCES,
          trucks.TRANSFORM,
          trucks.GENERATE, 
          require('../../src')
        ],
        js: js,
        manifest: true
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.output).to.be.an('object');

        const manifest = state.manifest;

        const jsFile = path.join(process.cwd(), js);
        expect(manifest[jsFile].checksum).to.be.a('string');

        done();
      }
    );
  });

});
