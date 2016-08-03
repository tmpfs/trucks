var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('stylus:', function() {

  it('should error on stylus compile', function(done) {
    const src = 'test/fixtures/stylus-error/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'stylus-error',
        transforms: [require('../../src')]
      }, (err) => {
        function fn() {
          throw err;
        }

        expect(err.name).to.eql('ParseError');
        expect(fn).throws(Error);

        done();
      }
    );
  });

});
