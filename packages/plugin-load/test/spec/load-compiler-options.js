var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('load:', function() {

  it('should use nested compile pass', function(done) {
    const src = 'test/fixtures/compiler-options/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'load-compiler-options',
        plugins: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
