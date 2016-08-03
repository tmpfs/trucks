var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('trucks-compiler');

describe('sass:', function() {

  it('should process @import directive', function(done) {
    const src = 'test/fixtures/sass-import/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'sass-import',
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const expected = fs.readFileSync(
          'test/expect/simple-component.css')
            .toString().trim();

        const css = 'target/sass-import.css';
        expect(fs.readFileSync(css).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});
