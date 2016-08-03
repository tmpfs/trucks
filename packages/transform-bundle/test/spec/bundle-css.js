var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('bundle:', function() {

  it('should prepend css file', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'bundle-css',
        transforms: [require('../../src')],
        conf: {
          transforms: {
            bundle: {
              css: ['test/fixtures/style.css']
            }
          } 
        }
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const output = state.getFile('target/bundle-css.css');
        expect(output).to.be.an('object');

        const contents = output.getFileContents();
        expect(contents).to.be.a('string')
          .to.eql('body {\n  margin: 0;\n  padding: 0;\n}\n'); 

        done();
      }
    );
  });

});
