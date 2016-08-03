var expect = require('chai').expect
  , plugin = require('../../src');

function getState(options) {
  const State = require('../../../../packages/trucks-compiler/src/state');
  return new State(options);
}

describe('file:', function() {

  it('should resolve compiler options', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , href = 'test/fixtures/compiler-options/components.html'
        , resolver = new Resolver(state, href);

    expect(resolver).to.be.an('object');
    resolver.resolve((err, contents) => {
      expect(err).to.eql(null);
      expect(contents).to.be.an('object')
      expect(contents.files).to.be.an('array');
      done();
    });
  });

});
