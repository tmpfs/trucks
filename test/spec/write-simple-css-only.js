var expect = require('chai').expect
  , path = require('path')
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should write css output', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , css = 'target/simple-css-only.css';
    trucks(
      {
        files: [src],
        css: css
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.output).to.be.an('object');

        const cssFile = path.join(process.cwd(), css);
        expect(state.output[cssFile].name).to.eql(css);
        expect(state.output[cssFile].result.file).to.be.a('string');

        done();
      }
    );
  });

});
