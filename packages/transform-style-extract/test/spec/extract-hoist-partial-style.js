var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('trucks-compiler');

describe('style-extract:', function() {

  it('should hoist partial style', function(done) {
    const src = '../../test/fixtures/component-partial-style/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'style-extract-hoist',
        force: true,
        transforms: [
          'trim/src',
          require('../../src')
        ]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const key = 'target/component-partial-style.css'
            , file = state.getFile('component-partial-style.css', 'target');

        expect(state.output[key]).to.eql(file);

        expect(file.base).to.eql('target');
        expect(file.name).to.eql('component-partial-style.css');

        const styles = 'target/component-partial-style.css';
        expect(fs.readFileSync(styles).toString().trim())
          .to.eql('p {\n  margin: 0;\n}\n\nem {\n  font-style: italic;\n}');

        done();
      }
    );
  });

});
