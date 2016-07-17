var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('trim:', function() {

  it('should not trim with disabled options', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'trim-options',
        transforms: [require('../../src')],
        conf: {
          transforms: {
            trim: {newlines: false, lines: false, pattern: /^\t+/}
          }
        }
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');
        done();
      }
    );
  });

});
