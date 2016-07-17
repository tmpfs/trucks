var expect = require('chai').expect
  , path = require('path')
  , trucks = require('../../../../src');

describe('generate:', function() {

  it('should generate js output', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , js = 'target/simple-js-only.js';
    trucks(
      {
        files: [src],
        plugins: [trucks.SOURCES, trucks.TRANSFORM, require('../../src')],
        js: js
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.output).to.be.an('object');

        const jsFile = path.join(process.cwd(), js);
        expect(state.output[jsFile].name).to.eql(js);

        done();
      }
    );
  });

});
