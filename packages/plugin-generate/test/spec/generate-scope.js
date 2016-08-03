var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('generate:', function() {

  it('should ignore shadow scope style', function(done) {
    const src = '../../test/fixtures/component-style/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'generate-scope',
        plugins: [
          trucks.SOURCES,
          trucks.TRANSFORM,
          require('../../src')
        ]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.getFile('generate-scope.css', 'target');

        // should be empty as this test fixture does not declare
        // any document scope styles
        expect(file.getFileContents()).to.eql('');

        done();
      }
    );
  });

});
