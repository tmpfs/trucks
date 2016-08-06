var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should inherit file with no files array', function(done) {
    const src = 'test/fixtures/inherit-files/components.html';
    trucks(
      {
        files: [src],
        out: process.cwd() + '/target',
        name: 'inherit-files'
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        expect(state.options).to.be.an('object');
        expect(state.tree).to.be.an('object');
        done();
      }
    );
  });

});
