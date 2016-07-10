var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should compile component with private dependency', function(done) {
    const src = 'test/fixtures/private-dependent/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'private-dependent'
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const result = state.result.transform
          , generated = state.result.generate;

        expect(result.tpl).to.be.an('array').to.have.length(2);
        expect(result.css).to.be.an('array').to.have.length(2);
        expect(result.js).to.be.an('array').to.have.length(2);

        // NOTE: assert that dependency is declared first

        expect(result.tpl[0].contents).to.eql(
          '<template id="x-icon"></template>');
        expect(result.tpl[1].contents).to.eql(
          '<template id="x-button"></template>');

        expect(result.css[0].contents).to.eql('x-icon {}');
        expect(result.css[1].contents).to.eql('x-button {}');


        expect(result.js[0].contents).to.eql(
          'skate.define(\'x-icon\', {});');
        expect(result.js[1].contents).to.eql(
          'skate.define(\'x-button\', {});');

        expect(generated.javascript)
          .to.eql(
            fs.readFileSync(
              'test/expect/private-dependent-javascript.js')
                .toString().trim());

        expect(generated.stylesheet)
          .to.eql(
            fs.readFileSync(
              'test/expect/private-dependent-stylesheet.css')
                .toString().trim());

        done();
      }
    );
  });

});
