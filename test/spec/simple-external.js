var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should compile simple external component', function(done) {
    const src = 'test/fixtures/simple-external/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'simple-external'
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.tree.imports[0]
            , generated = state.result.generate;

        expect(file.href).to.eql(src);

        // parse phase data
        expect(state.result.styles).to.be.an('array').to.have.length(1);
        expect(state.result.scripts).to.be.an('array').to.have.length(1);
        expect(state.result.templates).to.be.an('array').to.have.length(1);

        expect(state.result.templates[0].href).to.eql('simple-template.html');
        expect(state.result.templates[0].inline).to.eql(false);
        expect(state.result.templates[0].contents).to.be.a('string');

        expect(state.result.styles[0].href).to.eql('simple-component.css');
        expect(state.result.styles[0].inline).to.eql(false);
        expect(state.result.styles[0].contents).to.be.a('string');

        expect(state.result.scripts[0].href).to.eql('simple-component.js');
        expect(state.result.scripts[0].inline).to.eql(false);
        expect(state.result.scripts[0].contents).to.be.a('string');

        // babel ast state.result
        expect(state.result.scripts[0].result).to.be.an('object');
        // list of ast nodes for component definitions
        expect(state.result.scripts[0].components).to.be.an('object');

        expect(state.result.scripts[0].components['simple-component'])
          .to.be.an('object');

        // generate phase data
        expect(generated.stylesheet).to.be.a('string');
        expect(generated.javascript).to.be.a('string');

        const expected = fs.readFileSync('test/expect/simple-component.js')
          .toString().trim();
        expect(generated.javascript.trim()).to.eql(expected);

        done();
      }
    );
  });

});
