var expect = require('chai').expect
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should write js output', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , js = 'target/simple-js-only.js';
    trucks(
      {
        files: [src],
        js: js
      }, (err, result) => {
        expect(err).to.eql(null);

        console.log(result);
        done();
    });
  });

});
