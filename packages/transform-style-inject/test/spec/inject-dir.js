var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('style-inject:', function() {

  const src = '../../test/fixtures/component-style/components.html';

  before((done) => {
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'style-inject-before',
        force: true,
        transforms: [
          'trim/src',
          'style-extract'
        ]
      }, (err) => {
        done(err);
      }
    );
  })

  it('should use dir inject option', function(done) {
    trucks(
      {
        files: [src],
        name: 'style-inject-dir',
        force: true,
        transforms: [
          'trim/src',
          require('../../src')
        ],
        conf: {
          transforms: {
            'style-inject': {
              dir: 'target'
            }
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.tree.imports[0]
            , mod = file.modules[0]
            , component = mod.component;

        expect(component.styles.length).to.eql(1);
        expect(component.styles[0].contents).to.eql('p {\n  margin: 0;\n}');

        done();
      }
    );
  });

});
