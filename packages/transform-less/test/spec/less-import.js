var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('trucks-compiler');

describe('less:', function() {

  it('should process @import directive', function(done) {
    const src = 'test/fixtures/less-import/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'less-import',
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const expected = fs.readFileSync(
          'test/expect/simple-component.css')
            .toString().trim();

        const css = 'target/less-import.css';
        expect(fs.readFileSync(css).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});
