var expect = require('chai').expect
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should write html output', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , html = 'target/simple-html-only.html';
    trucks(
      {
        files: [src],
        html: html,
        extract: true
      },
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        expect(result.files).to.be.an('object');
        expect(result.files.html.file).to.eql(html);
        done();
      }
    );
  });

});
