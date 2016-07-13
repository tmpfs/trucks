var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should compile with trim options disabled', function(done) {
    const src = 'test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'trim-options',
        trim: {newlines: false, lines: false}
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
