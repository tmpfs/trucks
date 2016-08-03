var expect = require('chai').expect
  , path = require('path')
  , trucks = require('trucks-compiler');

describe('generate:', function() {

  it('should generate css output', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , css = 'target/simple-css-only.css';
    trucks(
      {
        files: [src],
        plugins: [trucks.SOURCES, trucks.TRANSFORM, require('../../src')],
        css: css
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.output).to.be.an('object');

        const cssFile = path.join(process.cwd(), css);
        expect(state.output[cssFile].name).to.eql(css);

        done();
      }
    );
  });

});
