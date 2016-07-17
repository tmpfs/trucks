var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../../src');

describe('write:', function() {

  it('should error if file exists', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , css = 'target/simple-exists.css';

    // mock an existing file
    fs.writeFileSync(css, '');

    trucks(
      {
        files: [src],
        plugins: [
          trucks.SOURCES, 
          trucks.TRANSFORM, 
          trucks.GENERATE,
          require('../../../src')
        ],
        css: css
      }, (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/cannot overwrite/);
        done();
      }
    );
  });

});
