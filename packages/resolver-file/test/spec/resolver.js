var expect = require('chai').expect
  , url = require('url')
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
        , uri = url.parse(href)
        , resolver = new Resolver(state, href, uri);

    expect(resolver).to.be.an('object');
    const file = resolver.getCanonicalPath();
    expect(file).to.eql(path.join(process.cwd(), name));

    // trigger placeholder fetch function
    resolver.fetch(() => {
      const resolved = resolver.getResolvedPath();
      expect(resolved).to.equal(file);

      resolver.getFileContents(done);
    });
  });

  it('should create resolver with parent', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , parent = {file: path.join(process.cwd(), 'test/fixtures/index.html')}
        , name = 'components.html'
        , href = name
        , uri = url.parse(href)
        , resolver = new Resolver(state, href, uri, parent);

    expect(resolver).to.be.an('object');
    const file = resolver.getCanonicalPath();
    expect(file).to.eql(
      path.join(path.dirname(parent.file), name));

    // trigger placeholder fetch function
    resolver.fetch(() => {
      const resolved = resolver.getResolvedPath();
      expect(resolved).to.equal(file);

      resolver.getFileContents(done);
    });
  });


  it('should error with missing file', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'test/fixtures/non-existent.html'
        , href = name
        , uri = url.parse(href)
        , resolver = new Resolver(state, href, uri);

    resolver.getFileContents((err) => {
      function fn() {
        throw err; 
      } 
      expect(fn).throws(/ENOENT/);
      done();
    });
  });

});
