var expect = require('chai').expect
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should write output files w/ out option', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , out = 'target'
      , name = 'mock-components'
      // default names for assertions
      , css = 'target/mock-components.css'
      , js = 'target/mock-components.js'
      , html = 'target/mock-components.html';
    trucks(
      {
        files: [src],
        out: out,
        name: name
      },
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');

        expect(result.files).to.be.an('object');
        expect(result.files.html.file).to.eql(html);
        expect(result.files.css.file).to.eql(css);
        expect(result.files.js.file).to.eql(js);
        done();
      }
    );
  });

});
