var expect = require('chai').expect
  , path = require('path')
  , trucks = require('../../../../src');

describe('write:', function() {

  it('should write css output', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , css = 'target/simple-css-only.css';
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
        manifest: true
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.output).to.be.an('object');

        const manifest = state.manifest;

        const cssFile = path.join(process.cwd(), css);
        expect(manifest[cssFile].name).to.eql(css);
        expect(manifest[cssFile].file).to.be.a('string');

        done();
      }
    );
  });

});
