var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('style-inject:', function() {
  const src = '../../test/fixtures/simple-inline/components.html';

  // NOTE: we don't extract beforehand

  it('should continue processing on missing component stylesheet (ENOENT)',
    function(done) {
      trucks(
        {
          files: [src],
          out: 'target',
          name: 'style-inject-enoent',
          force: true,
          transforms: [
            'trim/src',
            require('../../src')
          ]
        }, (err, state) => {
          expect(err).to.eql(null);
          expect(state).to.be.an('object');

          done();
        }
      );
  
    }
  );

});
