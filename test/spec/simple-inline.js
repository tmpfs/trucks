var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should compile simple inline component', function(done) {
    const src = 'test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'simple-inline'
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        expect(state.options).to.be.an('object');

        const generated = state.result.generate;

        // parse phase data
        expect(state.result.styles).to.be.an('array').to.have.length(1);
        expect(state.result.scripts).to.be.an('array').to.have.length(1);
        expect(state.result.templates).to.be.an('array').to.have.length(1);

        expect(state.result.templates[0].inline).to.eql(true);
        expect(state.result.templates[0].contents).to.be.a('string');

        expect(state.result.styles[0].inline).to.eql(true);
        expect(state.result.styles[0].contents).to.be.a('string');

        expect(state.result.scripts[0].inline).to.eql(true);
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

        expect(generated.javascript).to.eql(expected);

        done();
      }
    );
  });

});
