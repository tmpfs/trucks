var expect = require('chai').expect
  , trucks = require('../../src');

describe('trucks:', function() {

  it('should parse with options', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'parse-options',
        transforms: []
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        state.parse('', {lowerCaseAttributeNames: true});
        done();
      }
    );
  });

});
