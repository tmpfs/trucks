var expect = require('chai').expect
  , State = require('../../src/state')
  , Registry = require('../../src/registry');

function MockResolver() {}

describe('registry:', function() {

  it('should get / set default resolver', function(done) {
    const registry = new Registry();
    registry.setDefault(MockResolver);
    expect(registry.getDefault()).to.equal(MockResolver);
    done();
  });

  it('should use registered scheme', function(done) {
    const registry = new Registry();
    registry.register('foo:', MockResolver);
    expect(registry.getResolver('foo:')).to.eql(MockResolver);
    done();
  });

  it('should error with no registered scheme', function(done) {
    const registry = new Registry();
    function fn() {
      registry.factory(new State({}), 'foo://bar.com')
    }
    expect(fn).throws(/no resolver registered/);
    done();
  });

  it('should error with no type class and no scheme', function(done) {
    const registry = new Registry();
    function fn() {
      registry.factory(new State({}), 'bar')
    }
    expect(fn).throws(/no import resolver class/);
    done();
  });

  it('should error with non-function type for scheme', function(done) {
    const registry = new Registry();
    function fn() {
      registry.register('foo:', 'bar');
    }
    expect(fn).throws(/constructor function expected/);
    done();
  });

});
