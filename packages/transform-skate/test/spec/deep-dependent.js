var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('trucks-compiler');

describe('skate:', function() {

  it('should compile component with deep dependency', function(done) {
    const src = '../../test/fixtures/deep-dependent/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'deep-dependent',
        transforms: ['trim/src', require('../../src')]
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.tree.getTemplates()).to.be.an('array').to.have.length(3);
        expect(state.tree.getScripts()).to.be.an('array').to.have.length(3);

        // NOTE: assert that dependency is declared first

        expect(state.tree.getTemplates()[0].contents).to.eql(
          '<template id="x-icon"></template>');
        expect(state.tree.getTemplates()[1].contents).to.eql(
          '<template id="x-button"></template>');
        expect(state.tree.getTemplates()[2].contents).to.eql(
          '<template id="x-widget"></template>');

        expect(state.tree.getStyles()[0].contents).to.eql('x-icon {}');
        expect(state.tree.getStyles()[1].contents).to.eql('x-button {}');
        expect(state.tree.getStyles()[2].contents).to.eql('x-widget {}');

        expect(state.tree.getScripts()[0].contents).to.eql(
          'skate.define(\'x-icon\', {});');
        expect(state.tree.getScripts()[1].contents).to.eql(
          'skate.define(\'x-button\', {});');
        expect(state.tree.getScripts()[2].contents).to.eql(
          'skate.define(\'x-widget\', {});');

        const js = 'target/deep-dependent.js'
            , css = 'target/deep-dependent.css';

        expect(fs.readFileSync(js).toString())
          .to.eql(
            fs.readFileSync(
              '../../test/expect/deep-dependent-javascript.js')
                .toString().trim());

        expect(fs.readFileSync(css).toString())
          .to.eql(
            fs.readFileSync(
              '../../test/expect/deep-dependent-stylesheet.css')
                .toString().trim());

        done();
      }
    );
  });

});
