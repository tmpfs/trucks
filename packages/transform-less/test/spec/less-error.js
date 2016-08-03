var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('less:', function() {

  it('should error on less compile', function(done) {
    const src = 'test/fixtures/less-error/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'less-error',
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
