var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('csp:', function() {

  it('should use sha csp option', function(done) {
    const src = '../../test/fixtures/component-style/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'csp-sha-option',
        force: true,
        transforms: [require('../../src'), 'skate/src'],
        conf: {
          transforms: {
            csp: {
              sha: 'sha512'
            }
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const meta = fs.readFileSync(
                state.getFile('csp.html', 'target').file).toString()
            , txt = fs.readFileSync(
                state.getFile('csp.txt', 'target').file).toString()

        expect(/style-src 'self' 'sha512-/.test(meta)).to.eql(true);
        expect(/^style-src 'self' 'sha512-/.test(txt)).to.eql(true);

        done();
      }
    );
  });

});
