var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should compile component without template', function(done) {
    const src = '../../test/fixtures/no-template/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'no-template'
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
