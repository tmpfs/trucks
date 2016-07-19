var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('parse:', function() {

  it('should parse inline partial', function(done) {
    const src = '../../test/fixtures/inline-partial/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'inline-partial',
        plugins: [trucks.LOAD, require('../../src'), trucks.TRANSFORM],
        transforms: ['trim', 'skate/src']
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
        expect(mod.stylesheets.length).to.eql(4);

        // global scope module styles
        expect(mod.styles.length).to.eql(1);

        // local component scope styles
        expect(component.styles.length).to.eql(3);

        // list of all templates on the module
        expect(mod.templates).to.be.an('array')
          .to.have.length(3);

        expect(component).to.be.an('object');

        // primary template trait
        expect(component.template).to.be.an('object');

        // list of template partials
        expect(component.partials).to.be.an('array')
          .to.have.length(2);

        expect(component.id).to.be.a('string');
        expect(component.file).to.be.a('string');

        expect(component.template).to.equal(mod.templates[0]);
        expect(component.partials[0]).to.equal(mod.templates[1]);

        expect(mod.styles[0].inline).to.eql(true);
        expect(mod.styles[0].type).to.eql(undefined);

        mod.styles[0].type = 'text/css';
        expect(mod.styles[0].type).to.eql('text/css');

        expect(component.scripts).to.be.an('array');

        done();
      }
    );
  });

});
