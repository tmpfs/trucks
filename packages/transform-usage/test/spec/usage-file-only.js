var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('usage:', function() {

  it('should generate with file only option', function(done) {
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
          name: 'usage-file-only.html',
          main: false
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const component = state.getFile(
                'component-usage.usage-file-only.html', state.options.out);

        expect(component.contents).to.be.an('array')
          .to.have.length(2);

        done();
      }
    );
  });

});
