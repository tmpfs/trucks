var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('bundle:', function() {

  it('should use default options', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'bundle',
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
