var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should compile component with dependency', function(done) {
    const src = 'test/fixtures/dependent/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'dependent'
      },
      (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');

        console.dir(result.tpl);
        //console.dir(result.css);
        //console.dir(result.js);

        done();
      }
    );
  });

});
