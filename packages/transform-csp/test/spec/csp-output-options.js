var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('csp:', function() {

  it('should use custom output options', function(done) {
    const src = '../../test/fixtures/component-style/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'csp-output-options',
        force: true,
        transforms: [require('../../src'), 'skate/src'],
        conf: {
          transforms: {
            csp: {
              html: 'csp-meta.html',
              text: 'csp-headers.txt',
              dir: 'target'
            }
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.tree.imports[0]
            , mod = file.modules[0]
            , style = mod.stylesheets[0]
            , meta = fs.readFileSync(
                state.getFile('csp-meta.html', 'target').file).toString()
            , txt = fs.readFileSync(
                state.getFile('csp-headers.txt', 'target').file).toString()

        expect(/nonce="([^"]+)"/.test(style.contents)).to.eql(true);

        expect(/style-src 'self' nonce-/.test(meta)).to.eql(true);
        expect(/^style-src 'self' nonce-/.test(txt)).to.eql(true);

        done();
      }
    );
  });

});
