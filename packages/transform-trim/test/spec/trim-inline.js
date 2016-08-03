var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('trim:', function() {

  it('should trim inline elements only', function(done) {
    const src = '../../test/fixtures/simple-external/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'trim-inline',
        transforms: [require('../../src')],
        conf: {
          transforms: {
            trim: {inline: true}
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
