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
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');

        // parse phase data
        expect(result.css).to.be.an('array').to.have.length(1);
        expect(result.js).to.be.an('array').to.have.length(1);
        expect(result.tpl).to.be.an('array').to.have.length(1);

        expect(result.tpl[0].parent).to.eql(src);
        expect(result.tpl[0].file).to.eql(
          'test/fixtures/simple-external/simple-template.html');
        expect(result.tpl[0].inline).to.eql(undefined);
        expect(result.tpl[0].contents).to.be.a('string');

        expect(result.css[0].parent).to.eql(src);
        expect(result.css[0].file).to.eql(
          'test/fixtures/simple-external/simple-component.css');
        expect(result.css[0].inline).to.eql(undefined);
        expect(result.css[0].contents).to.be.a('string');

        expect(result.js[0].parent).to.eql(src);
        expect(result.js[0].file).to.eql(
          'test/fixtures/simple-external/simple-component.js');
        expect(result.js[0].inline).to.eql(undefined);
        expect(result.js[0].contents).to.be.a('string');

        // babel ast result
        expect(result.js[0].result).to.be.an('object');
        // list of ast nodes for component definitions
        expect(result.js[0].components).to.be.an('object');

        expect(result.js[0].components['simple-component'])
          .to.be.an('object');

        // generate phase data
        expect(result.stylesheet).to.be.a('string');
        expect(result.javascript).to.be.a('string');

        const expected = fs.readFileSync('test/expect/simple-component.js')
          .toString().trim();
        expect(result.javascript.trim()).to.eql(expected);

        done();
      }
    );
  });

});
