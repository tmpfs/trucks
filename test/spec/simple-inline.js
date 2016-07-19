var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should compile simple inline component', function(done) {
    const src = 'test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'simple-inline',
        transforms: ['trim/src', 'skate/src']
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const output = state.getFile(state.options.js)
            , outfile = state.output[output.file];

        // same object
        expect(output).to.be.an('object')
          .to.equal(outfile);

        const file = state.tree.imports[0]
            , mod = file.imports[0].modules[0]
            , component = mod.component;

        // all styles for the module
        expect(mod.stylesheets.length).to.eql(1);

        // global scope module styles
        expect(mod.styles.length).to.eql(1);

        // local component scope styles
        expect(component.styles.length).to.eql(0);

        done();
      }
    );
  });

});
