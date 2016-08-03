var expect = require('chai').expect
  , plugin = require('../../src')
  , expected = '<dom-module id="mock-http-resolver"></dom-module>\n';

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
  const State = require('../../../../packages/trucks-compiler/src/state');
  return new State(options);
}

describe('http:', function() {

  it('should run plugin function', function(done) {
    const state = {}
      , conf = {secure: true};

    let closure = plugin(state, conf);
    expect(closure).to.be.a('function').to.have.length(1);
    closure(getRegistry({}));
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
      result._schemes[plugin.Resolver.HTTP]).to.equal(plugin.Resolver);
    expect(
      result._schemes[plugin.Resolver.HTTPS]).to.equal(plugin.Resolver);

    done();
  });

// https://raw.githubusercontent.com/tmpfs/trucks/master/test/fixtures \
// /simple-inline/components.html

  it('should create resolver without parent', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'http://localhost:3001/components.html'
        //, name = 'https://raw.githubusercontent.com/tmpfs/trucks/master/test/fixtures/simple-inline/components.html'
        , href = name
        , resolver = new Resolver(state, href);

    expect(resolver).to.be.an('object');
    const file = resolver.getCanonicalPath();

    // check acccessor
    resolver.file = file;
    expect(resolver.file).to.eql(file);

    expect(file).to.eql(href);

    expect(resolver.getDefaultPort(Resolver.HTTP, {}))
      .to.be.an('object').to.have.property('port').that.equals(80);

    expect(resolver.getDefaultPort(Resolver.HTTPS, {}))
      .to.be.an('object').to.have.property('port').that.equals(443);

    resolver.resolve((err, contents) => {
      expect(err).to.eql(null);
      expect(contents).to.be.instanceof(Buffer);
      expect(contents.toString()).to.eql(expected);
      done();
    });
  });

  it('should create resolver with parent', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , parent = {file: 'http://localhost:3001'}
        , name = 'components.html'
        , href = name
        , resolver = new Resolver(state, href, parent);

    expect(resolver).to.be.an('object');
    const file = resolver.getCanonicalPath();
    expect(file).to.eql(parent.file + '/' + href);

    resolver.resolve(done);
  });

  it('should handle file with gzip compresion', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'http://localhost:3001/components.html.tgz'
        , href = name
        , resolver = new Resolver(state, href);

    expect(resolver).to.be.an('object');

    resolver.resolve((err, contents) => {
      expect(err).to.eql(null);
      expect(contents).to.be.instanceof(Buffer);
      expect(contents.toString()).to.eql(expected);
      done();
    });
  });

  it('should error with no scheme in parsed URL', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = '://localhost:60000/components.html'
        , href = name
        , resolver = new Resolver(state, href);

    resolver.resolve((err) => {
      function fn() {
        throw err; 
      } 
      expect(fn).throws(/attempt to load with no protocol/);
      done();
    });
  });

  it('should error with ECONNREFUSED', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'http://localhost:60000/components.html'
        , href = name
        , resolver = new Resolver(state, href);

    resolver.resolve((err) => {
      function fn() {
        throw err; 
      } 
      expect(fn).throws(/ECONNREFUSED/);
      done();
    });
  });

  it('should error with 404 status code', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'http://localhost:3001/non-existent.html'
        , href = name
        , resolver = new Resolver(state, href);

    resolver.resolve((err) => {
      function fn() {
        throw err; 
      } 
      expect(fn).throws(/unexpected status code 404/);
      done();
    });
  });

  it('should error with bad content type', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'http://localhost:3001/mock.xml'
        , href = name
        , resolver = new Resolver(state, href);

    resolver.resolve((err) => {
      function fn() {
        throw err; 
      } 
      expect(fn).throws(/unexpected content type/);
      done();
    });
  });
});
