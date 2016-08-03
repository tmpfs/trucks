var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('page:', function() {

  it('should process input file', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'page-mock',
        transforms: [require('../../src')],
        page: {
          files: {
            'test/fixtures/mock-page.html': 'mock-page.html'
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        done();
      }
    );
  });

});
