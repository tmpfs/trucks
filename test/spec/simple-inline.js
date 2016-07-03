var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should compile simple inline component', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
      , file = 'test/fixtures/simple-inline/simple-component.html';
    trucks(
      {
        files: [src]
      },
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        expect(result.options).to.be.an('object');

        // parse phase data
        expect(result.css).to.be.an('array').to.have.length(1);
        expect(result.js).to.be.an('array').to.have.length(1);
        expect(result.tpl).to.be.an('array').to.have.length(1);

        expect(result.tpl[0].parent).to.eql(src);
        expect(result.tpl[0].file).to.eql(file);
        expect(result.tpl[0].inline).to.eql(true);
        expect(result.tpl[0].contents).to.be.a('string');

        expect(result.css[0].parent).to.eql(src);
        expect(result.css[0].file).to.eql(file);
        expect(result.css[0].inline).to.eql(true);
        expect(result.css[0].contents).to.be.a('string');

        expect(result.js[0].parent).to.eql(src);
        expect(result.js[0].file).to.eql(file);
        expect(result.js[0].inline).to.eql(true);
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
        expect(result.javascript).to.eql(expected);

        done();
      }
    );
  });

});
