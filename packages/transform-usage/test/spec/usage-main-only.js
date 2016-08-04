var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('usage:', function() {

  it('should generate with main only option', function(done) {
    const src = '../../test/fixtures/component-usage/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'usage-spec',
        force: true,
        html: false,
        css: false,
        js: false,
        transforms: [require('../../src')],
        usage: {
          name: 'usage-main-only.html',
          file: false
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const main = state.getFile('usage-main-only.html', state.options.out);

        expect(main.contents).to.be.an('array')
          .to.have.length(2);

        done();
      }
    );
  });

});
