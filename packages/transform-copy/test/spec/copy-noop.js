var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('copy:', function() {

  it('should noop on same path', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'test/fixtures',
        name: 'copy-noop',
        transforms: [require('../../src')],
        html: false,
        js: false,
        css: false,
        copy: {
          files: {
            'test/fixtures/app.js': 'app.js'
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
