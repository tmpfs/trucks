var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('trim:', function() {

  it('should trim inline elements only', function(done) {
    const src = '../../test/fixtures/simple-external/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'trim-inline',
        trim: {inline: true},
        transforms: [require('../../src')]
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
