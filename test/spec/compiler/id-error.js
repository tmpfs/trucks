var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('compiler:', function() {

  it('should error without component identifier', function(done) {
    const tpl = '<template></template>';
    function fn() {
      trucks.compile(tpl);
    }

    expect(fn).throws(/template declared with no identifier/);

    done();
  });

});
