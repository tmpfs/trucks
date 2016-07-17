var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('stylus:', function() {

  it('should process external styles', function(done) {
    const src = 'test/fixtures/stylus-external/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'stylus-external',
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const expected = fs.readFileSync(
          'test/expect/simple-component.css')
            .toString().trim();

        const css = 'target/stylus-external.css';
        expect(fs.readFileSync(css).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});
