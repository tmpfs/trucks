var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('skate:', function() {

  it('should compile component with dependency', function(done) {
    const src = '../../test/fixtures/dependent/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'dependent',
        transforms: ['trim/src', require('../../src')]
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.result.templates).to.be.an('array').to.have.length(2);
        expect(state.tree.getStyles()).to.be.an('array').to.have.length(2);
        expect(state.tree.getScripts()).to.be.an('array').to.have.length(2);

        // NOTE: assert that dependency is declared first

        expect(state.result.templates[0].contents).to.eql(
          '<template id="x-icon"></template>');
        expect(state.result.templates[1].contents).to.eql(
          '<template id="x-button"></template>');

        expect(state.tree.getStyles()[0].contents).to.eql('x-icon {}');
        expect(state.tree.getStyles()[1].contents).to.eql('x-button {}');

        expect(state.tree.getScripts()[0].contents).to.eql(
          'skate.define(\'x-icon\', {});');
        expect(state.tree.getScripts()[1].contents).to.eql(
          'skate.define(\'x-button\', {});');

        const js = 'target/dependent.js'
            , css = 'target/dependent.css';

        expect(fs.readFileSync(js).toString())
          .to.eql(
            fs.readFileSync(
              '../../test/expect/dependent-javascript.js').toString().trim());

        expect(fs.readFileSync(css).toString())
          .to.eql(
            fs.readFileSync(
              '../../test/expect/dependent-stylesheet.css').toString().trim());

        done();
      }
    );
  });

});
