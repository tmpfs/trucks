var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should parse inline partial', function(done) {
    const src = 'test/fixtures/inline-partial/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'inline-partial'
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.tree.imports[0]
            , mod = file.imports[0].modules[0]
            , component = mod.component;

        expect(component).to.be.an('object');
        expect(component.partials).to.be.an('array')
          .to.have.length(1);

        done();
      }
    );
  });

});
