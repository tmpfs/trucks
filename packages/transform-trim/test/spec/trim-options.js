var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('trim:', function() {

  it('should use custom options', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'trim-options',
        transforms: [require('../../src')],
        conf: {
          transforms: {
            trim: {templates: true, lines: false, pattern: /^\t+/}
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
