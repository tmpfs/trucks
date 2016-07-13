var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should write output files w/ out option', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , out = 'target'
      , name = 'mock-components'
      // names for assertions
      , css = 'target/mock-components.css'
      , js = 'target/mock-components.js'
      , html = 'target/mock-components.html';
    trucks(
      {
        files: [src],
        out: out,
        name: name,
        extract: true
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const result = state.result.write;
        expect(result.files).to.be.an('object');
        expect(result.files.html.file).to.eql(html);
        expect(result.files.css.file).to.eql(css);
        expect(result.files.js.file).to.eql(js);
        done();
      }
    );
  });

  it('should write output files w/ out option and default name',
    function(done) {
      const src = 'test/fixtures/simple-inline/components.html'
        , out = 'target'
        // names for assertions
        , css = 'target/components.css'
        , js = 'target/components.js'
        , html = 'target/components.html';
      trucks(
        {
          files: [src],
          force: true,
          out: out,
          name: null,
          extract: true
        },
        (err, state) => {
          expect(err).to.eql(null);
          expect(state).to.be.an('object');

        const result = state.result.write;
          expect(result.files).to.be.an('object');
          expect(result.files.html.file).to.eql(html);
          expect(result.files.css.file).to.eql(css);
          expect(result.files.js.file).to.eql(js);
          done();
        }
      );
    }
  );

});
