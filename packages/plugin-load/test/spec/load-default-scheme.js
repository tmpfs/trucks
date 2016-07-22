var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('load:', function() {

  it('should use default scheme configuration', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'load',
        plugins: [require('../../src')],
        conf: {
          plugins: {
            load: {
              protocols: ['file']
            }
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
