var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('stylus:', function() {

  it('should process @import directive', function(done) {
    const src = 'test/fixtures/stylus-import/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'stylus-import',
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const expected = fs.readFileSync(
          'test/expect/simple-component.css')
            .toString().trim();

        const css = 'target/stylus-import.css';
        expect(fs.readFileSync(css).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});
