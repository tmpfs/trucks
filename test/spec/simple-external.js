var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../src');

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

        //const result = state.result.transform
        const file = state.tree.imports[0]
          , component = file.imports[0]
          , result = component.modules[0]
          , generated = state.result.generate;

        // parse phase data
        expect(result.css).to.be.an('array').to.have.length(1);
        expect(result.js).to.be.an('array').to.have.length(1);
        expect(result.tpl).to.be.an('array').to.have.length(1);

        console.dir(result.tpl[0].href);
        console.dir(result.tpl[0].file);

        expect(file.href).to.eql(src);

        expect(result.tpl[0].href).to.eql('simple-template.html');
        expect(result.tpl[0].inline).to.eql(undefined);
        expect(result.tpl[0].contents).to.be.a('string');

        expect(result.css[0].href).to.eql('simple-component.css');
        expect(result.css[0].inline).to.eql(undefined);
        expect(result.css[0].contents).to.be.a('string');

        expect(result.js[0].href).to.eql('simple-component.js');
        expect(result.js[0].inline).to.eql(undefined);
        expect(result.js[0].contents).to.be.a('string');

        // babel ast result
        expect(result.js[0].result).to.be.an('object');
        // list of ast nodes for component definitions
        expect(result.js[0].components).to.be.an('object');

        expect(result.js[0].components['simple-component'])
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
