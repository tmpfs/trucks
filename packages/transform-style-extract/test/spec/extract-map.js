var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('trucks-compiler');

describe('style-extract:', function() {

  it('should use stylesheet configuration map', function(done) {
    const src = '../../test/fixtures/component-style/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'style-extract',
        force: true,
        transforms: [
          'trim/src',
          require('../../src')
        ],
        stylesheets: {
          'component-style': 'component-stylesheet.css' 
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const styles = 'target/component-stylesheet.css';
        expect(fs.readFileSync(styles).toString().trim())
          .to.eql('p {\n  margin: 0;\n}');

        done();
      }
    );
  });

});
