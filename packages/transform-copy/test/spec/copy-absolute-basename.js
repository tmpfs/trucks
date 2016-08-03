var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('copy:', function() {

  it('should copy with absolute path using basename', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'copy-absolute-basename',
        transforms: [require('../../src')],
        copy: {
          files: {
            'test/fixtures/app.js': process.cwd() + '/basename-app.js'
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.getFile('basename-app.js', 'target');
        expect(file).to.be.an('object');
        expect(file.contents).to.be.an('array').to.have.length(1);
        done();
      }
    );
  });

});
