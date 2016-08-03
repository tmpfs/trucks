var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('trucks-compiler');

describe('style-extract:', function() {

  it('should use dir extract option', function(done) {
    const src = '../../test/fixtures/component-style/components.html';
    trucks(
      {
        files: [src],
        name: 'style-extract-dir',
        force: true,
        transforms: [
          'trim/src',
          require('../../src')
        ],
        conf: {
          transforms: {
            'style-extract': {
              dir: 'target'
            }
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const key = 'target/component-style.css'
            , file = state.getFile('component-style.css', 'target');

        expect(state.output[key]).to.eql(file);

        expect(file.base).to.eql('target');
        expect(file.name).to.eql('component-style.css');

        const styles = 'target/component-style.css';
        expect(fs.readFileSync(styles).toString().trim())
          .to.eql('p {\n  margin: 0;\n}');

        done();
      }
    );
  });

});
