var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('less:', function() {

  it('should process inline styles and ignore other types', function(done) {
    const src = 'test/fixtures/less-other-type/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'less-other-type',
        transforms: ['trim/src', require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const expected = fs.readFileSync(
          'test/expect/mixed-component.css')
            .toString().trim();

        const css = 'target/less-other-type.css';
        expect(fs.readFileSync(css).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});
