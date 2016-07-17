var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should use default name option', function(done) {
    const src = 'test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        force: true,
        out: 'target',
        name: ''
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
