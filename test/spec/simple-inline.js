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
        name: 'simple-inline',
        transforms: ['trim/src', 'skate/src']
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        expect(state.options).to.be.an('object');

        const file = state.tree.imports[0];
        expect(file.href).to.eql(src);

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

        const expected = fs.readFileSync('test/expect/simple-component.js')
          .toString().trim();

        const js = 'target/simple-inline.js';
        expect(fs.readFileSync(js).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});
