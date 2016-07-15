var expect = require('chai').expect
  , path = require('path')
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should write js output', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , js = 'target/simple-js-only.js';
    trucks(
      {
        files: [src],
        js: js
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.output).to.be.an('object');

        const jsFile = path.join(process.cwd(), js);
        expect(state.output[jsFile].name).to.eql(js);
        expect(state.output[jsFile].result.file).to.be.a('string');

        done();
      }
    );
  });

});
