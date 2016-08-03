var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('trim:', function() {

  it('should trim with template scope', function(done) {
    const src = '../../test/fixtures/component-style/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'trim-template-scope',
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.tree.imports[0]
            , module = file.modules[0];

        expect(
          module.component.styles[0].contents).to.eql('p {\n  margin: 0;\n}')
        done();
      }
    );
  });

});
