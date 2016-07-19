var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('skate:', function() {

  it('should compile simple external component', function(done) {
    const src = '../../test/fixtures/simple-external/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'simple-external',
        transforms: [require('../../src')]
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        expect(state.options).to.be.an('object');

        const file = state.tree.imports[0];
        expect(file.href).to.eql(src);

        // parse phase data
        expect(state.tree.getStyles()).to.be.an('array').to.have.length(1);
        expect(state.result.scripts).to.be.an('array').to.have.length(1);
        expect(state.result.templates).to.be.an('array').to.have.length(1);

        expect(state.result.templates[0].href).to.eql('simple-template.html');
        expect(state.result.templates[0].inline).to.eql(false);
        expect(state.result.templates[0].contents).to.be.a('string');

        expect(state.tree.getStyles()[0].href).to.eql('simple-component.css');
        expect(state.tree.getStyles()[0].inline).to.eql(false);
        expect(state.tree.getStyles()[0].contents).to.be.a('string');

        expect(state.result.scripts[0].href).to.eql('simple-component.js');
        expect(state.result.scripts[0].inline).to.eql(false);
        expect(state.result.scripts[0].contents).to.be.a('string');

        const expected = fs.readFileSync(
          '../../test/expect/simple-component.js')
            .toString().trim();
        const js = 'target/simple-external.js';
        expect(fs.readFileSync(js).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});
