var expect = require('chai').expect
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

        const result = state.result.write;
        expect(result.files).to.be.an('object');
        expect(result.files.js.file).to.eql(js);
        done();
      }
    );
  });

});
