var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('trucks-compiler');

describe('csp:', function() {

  it('should disable self option', function(done) {
    const src = '../../test/fixtures/component-style/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'csp-self-option',
        force: true,
        transforms: [require('../../src'), 'skate/src'],
        conf: {
          transforms: {
            csp: {
              self: false
            }
          }
        }
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

        expect(/style-src 'nonce-/.test(meta)).to.eql(true);
        expect(/^style-src 'nonce-/.test(txt)).to.eql(true);

        done();
      }
    );
  });

});
