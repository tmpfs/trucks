var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('sass:', function() {

  it('should process external styles', function(done) {
    const src = 'test/fixtures/sass-external/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'sass-external',
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const expected = fs.readFileSync(
          'test/expect/simple-component.css')
            .toString().trim();

        const css = 'target/sass-external.css';
        expect(fs.readFileSync(css).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});
