var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('load:', function() {

  it('should error on empty component file', function(done) {
    trucks.load(
        {files: ['test/fixtures/error/empty-component/components.html']},
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/empty component file/);
        done();
    });
  });

});
