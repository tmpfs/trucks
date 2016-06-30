var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('write:', function() {

  it('should error on write with no stylesheet', function(done) {
    trucks.write(
      {},
      {css: 'target/error.css'},
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/no stylesheet data/);
        done();
      }
    );
  });

  it('should error on write with no javascript', function(done) {
    trucks.write(
      {},
      {js: 'target/error.js'},
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/no javascript data/);
        done();
      }
    );
  });

  it('should error on write with non-existent path', function(done) {
    trucks.write(
      {stylesheet: 'x-component{}'},
      {css: 'non-existent/error.css'},
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/ENOENT/);
        done();
      }
    );
  });

});
