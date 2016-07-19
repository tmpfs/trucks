var expect = require('chai').expect
  , path = require('path')
  , trucks = require('../../../../src');

describe('generate:', function() {

  it('should generate html output', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , html = 'target/simple-html-only.html';
    trucks(
      {
        files: [src],
        plugins: [trucks.SOURCES, trucks.TRANSFORM, require('../../src')],
        html: html
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.output).to.be.an('object');

        const htmlFile = path.join(process.cwd(), html);
        expect(state.output[htmlFile].name).to.eql(html);

        done();
      }
    );
  });

});
