var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('bundle:', function() {

  it('should prepend html file', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'bundle-html',
        transforms: [require('../../src')],
        conf: {
          transforms: {
            bundle: {
              html: ['test/fixtures/templates.html']
            }
          } 
        }
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const output = state.getFile('target/bundle-html.html');
        expect(output).to.be.an('object');

        const contents = output.getFileContents();
        expect(contents).to.be.a('string')
          .to.eql('<template id="bundled-template"></template>\n');

        done();
      }
    );
  });

});
