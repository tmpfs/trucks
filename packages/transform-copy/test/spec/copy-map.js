var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('copy:', function() {

  it('should copy with file map', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'copy-map',
        transforms: [require('../../src')],
        copy: {
          files: {
            'test/fixtures/app.js': 'app.js'
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.getFile('app.js', 'target');
        expect(file).to.be.an('object');
        expect(file.contents).to.be.an('array').to.have.length(1);
        done();
      }
    );
  });

});
