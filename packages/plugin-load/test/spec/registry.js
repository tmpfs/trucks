var expect = require('chai').expect
  , registry = require('../../src/registry');

function MockResolver() {}

describe('registry:', function() {

  it('should get / set default resolver', function(done) {
    registry.setDefault(MockResolver);
    expect(registry.getDefault()).to.equal(MockResolver);
    done();
  });

  it('should error with non-function type for scheme', function(done) {
    function fn() {
      registry.register('foo:', 'bar');
    }
    expect(fn).throws(/constructor function expected/);
    done();
  });


});
