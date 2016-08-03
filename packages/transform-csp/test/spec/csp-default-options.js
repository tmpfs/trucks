var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('trucks-compiler');

describe('csp:', function() {

  it('should use default csp options', function(done) {
    const src = '../../test/fixtures/component-style/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'csp-default-options',
        force: true,
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.tree.imports[0]
            , mod = file.modules[0]
            , component = mod.component
            , style = component.styles[0]
            , meta = fs.readFileSync(
                state.getFile('csp.html', 'target').file).toString()
            , txt = fs.readFileSync(
                state.getFile('csp.txt', 'target').file).toString()

        expect(style.attr('nonce')).to.be.a('string');

        expect(/style-src 'self' 'nonce-/.test(meta)).to.eql(true);
        expect(/^style-src 'self' 'nonce-/.test(txt)).to.eql(true);

        done();
      }
    );
  });

});
