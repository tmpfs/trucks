var expect = require('chai').expect
  , Registry = require('../../src/registry')
  , State = require('../../src/state')
  , Resolver = require('trucks-resolver-core');

class MockResolver extends Resolver {
  constructor() {
    super(...arguments);
  } 
}

describe('trucks:', function() {

  it('should use parent resolver', function(done) {
    const state = new State()
        , parent = new MockResolver(state, 'mock://parent')
        , registry = new Registry()

    registry.register('mock:', MockResolver);

    let res = registry.factory(state, 'mock://child', parent);
    expect(res).to.be.an('object');

    done();
  });

});
