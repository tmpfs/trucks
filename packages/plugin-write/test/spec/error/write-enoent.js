var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('write:', function() {

  // NOTE: unlike the other ENOENT test spec this triggers a
  // NOTE: different code path
  it('should proxy write error', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , css = 'non-existent/simple.css'
      , js = 'non-existent/simple.js';

    trucks(
      {
        files: [src],
        plugins: [
          trucks.SOURCES, 
          trucks.TRANSFORM, 
          trucks.GENERATE,
          require('../../../src')
        ],
        css: css,
        js: js,
        write: {
          mkdirs: false
        }
      }, (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/ENOENT/);
        done();
      }
    );
  });

});
