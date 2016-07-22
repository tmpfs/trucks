var expect = require('chai').expect
  , path = require('path')
  , plugin = require('../../src');

function getRegistry(result) {
  result._schemes = {};

  return {
    setDefault: (type) => {
      result._default = type; 
    },
    register: (scheme, type) => {
      result._schemes[scheme] =  type;
    }
  }
}

function getState(options) {
  const State = require('../../../../src/state');
  return new State(options);
}

describe('file:', function() {

  it('should run plugin function', function(done) {
    const state = {}
      , conf = {};

    let closure = plugin(state, conf);
    expect(closure).to.be.a('function').to.have.length(1);
    done();
  });


  it('should run plugin closure function', function(done) {
    const state = {}
      , conf = {}
      , result = {}
      , registry = getRegistry(result);

    let closure = plugin(state, conf);
    closure(registry);

    expect(
      result._default).to.equal(plugin.Resolver);
    expect(
      result._schemes[plugin.Resolver.SCHEME]).to.equal(plugin.Resolver);

    done();
  });

  it('should create resolver without parent', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'test/fixtures/components.html'
        , href = name
        , resolver = new Resolver(state, href);

    expect(resolver).to.be.an('object');
    const file = resolver.getCanonicalPath();

    // check acccessor
    resolver.file = file;
    expect(resolver.file).to.eql(file);
    expect(file).to.eql(path.join(process.cwd(), name));
    resolver.resolve(done);
  });

  it('should create resolver with parent', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , parent = {file: path.join(process.cwd(), 'test/fixtures/index.html')}
        , name = 'components.html'
        , href = name
        , resolver = new Resolver(state, href, parent);

    expect(resolver).to.be.an('object');
    const file = resolver.getCanonicalPath();
    expect(file).to.eql(
      path.join(path.dirname(parent.file), name));
    resolver.resolve(done);
  });

  it('should error with missing file', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'test/fixtures/non-existent.html'
        , href = name
        , resolver = new Resolver(state, href);

    resolver.resolve((err) => {
      function fn() {
        throw err; 
      } 
      expect(fn).throws(/ENOENT/);
      done();
    });
  });

});
