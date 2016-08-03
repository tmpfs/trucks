var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('sass:', function() {

  it('should error on sass compile', function(done) {
    const src = 'test/fixtures/sass-error/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'sass-error',
        transforms: [require('../../src')]
      }, (err) => {
        function fn() {
          throw err;
        }

        //expect(err.name).to.eql('ParseError');
        expect(fn).throws(Error);

        done();
      }
    );
  });

});
