var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('stylus:', function() {

  it('should process inline styles and ignore other types', function(done) {
    const src = 'test/fixtures/stylus-other-type/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'stylus-other-type',
        transforms: ['trim', require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const expected = fs.readFileSync(
          'test/expect/mixed-component.css')
            .toString().trim();

        const css = 'target/stylus-other-type.css';
        expect(fs.readFileSync(css).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});
