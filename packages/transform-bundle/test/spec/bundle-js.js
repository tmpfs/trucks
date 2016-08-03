var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('bundle:', function() {

  it('should prepend javascript file', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'bundle-js',
        transforms: [require('../../src')],
        conf: {
          transforms: {
            bundle: {
              js: ['test/fixtures/app.js']
            }
          } 
        }
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const output = state.getFile('target/bundle-js.js');
        expect(output).to.be.an('object');

        const contents = output.getFileContents();
        expect(contents).to.be.a('string')
          .to.eql('function Application(){}\n'); 

        done();
      }
    );
  });

});
