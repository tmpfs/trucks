var expect = require('chai').expect
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should write output files', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , css = 'target/simple.css'
      , js = 'target/simple.js';
    trucks(
      {
        files: [src],
        css: css,
        js: js
      }, (err, result) => {
        expect(err).to.eql(null);

        console.log(result);
        done();
    });
  });

});
