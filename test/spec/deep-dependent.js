var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should compile component with deep dependency', function(done) {
    const src = 'test/fixtures/deep-dependent/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'deep-dependent'
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const result = state.result.transform
          , generated = state.result.generate;

        expect(result.tpl).to.be.an('array').to.have.length(3);
        expect(result.css).to.be.an('array').to.have.length(3);
        expect(result.js).to.be.an('array').to.have.length(3);

        // NOTE: assert that dependency is declared first

        expect(result.tpl[0].contents).to.eql(
          '<template id="x-icon"></template>');
        expect(result.tpl[1].contents).to.eql(
          '<template id="x-button"></template>');
        expect(result.tpl[2].contents).to.eql(
          '<template id="x-widget"></template>');

        expect(result.css[0].contents).to.eql('x-icon {}');
        expect(result.css[1].contents).to.eql('x-button {}');
        expect(result.css[2].contents).to.eql('x-widget {}');

        expect(result.js[0].contents).to.eql(
          'skate.define(\'x-icon\', {});');
        expect(result.js[1].contents).to.eql(
          'skate.define(\'x-button\', {});');
        expect(result.js[2].contents).to.eql(
          'skate.define(\'x-widget\', {});');

        expect(generated.javascript)
          .to.eql(
            fs.readFileSync(
              'test/expect/deep-dependent-javascript.js').toString().trim());

        expect(generated.stylesheet)
          .to.eql(
            fs.readFileSync(
              'test/expect/deep-dependent-stylesheet.css').toString().trim());

        done();
      }
    );
  });

});
