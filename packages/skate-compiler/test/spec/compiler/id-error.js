var expect = require('chai').expect
  , compiler = require('../../../src/compiler');

describe('compiler:', function() {

  it('should error without component identifier', function(done) {
    const tpl = '<template></template>';
    function fn() {
      compiler.html(tpl);
    }

    expect(fn).throws(/template declared with no identifier/);

    done();
  });

});
