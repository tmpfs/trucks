var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('skate:', function() {

  it('should compile without id replacement', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'id-disabled',
        conf: {
          transforms: {
            skate: {
              id: {pattern: null} 
            }
          }
        },
        transforms: ['trim/src', require('../../src')]
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        expect(state.options).to.be.an('object');

        const file = state.tree.imports[0];
        expect(file.href).to.eql(src);

        // parse phase data
        expect(state.result.scripts).to.be.an('array').to.have.length(1);
        expect(state.result.templates).to.be.an('array').to.have.length(1);

        expect(state.result.templates[0].inline).to.eql(true);
        expect(state.result.templates[0].contents).to.be.a('string');

        //expect(state.result.styles[0].inline).to.eql(true);
        //expect(state.result.styles[0].contents).to.be.a('string');

        expect(state.result.scripts[0].inline).to.eql(true);
        expect(state.result.scripts[0].contents).to.be.a('string');

        const expected = fs.readFileSync(
          '../../test/expect/simple-component-id-disabled.js')
            .toString().trim();

        const js = 'target/id-disabled.js';
        expect(fs.readFileSync(js).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});
