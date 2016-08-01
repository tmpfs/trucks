var expect = require('chai').expect
  , path = require('path')
  , plugin = require('../../src')
  , expected = '<dom-module id="mock-npm-resolver"></dom-module>\n';

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

describe('npm:', function() {

  before((done) => {
    process.env.PATH = 'test/bin:' + process.env.PATH; 
    done();
  });

  afterEach((done) => {
    const exec = require('child_process').exec;
    exec('rm -rf node_modules/mock-*', done); 
  })

  // give packages time to install
  this.timeout(30000);

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
      result._schemes[plugin.Resolver.SCHEME]).to.equal(plugin.Resolver);
    done();
  });

  it('should resolve npm:// protocol with local path', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'test/fixtures/mock-npm-package'
        , href = name
        , resolver = new Resolver(state, 'npm://' + href);

    expect(resolver).to.be.an('object');
    const file = resolver.getCanonicalPath();

    // check acccessor
    resolver.file = file;
    expect(resolver.file).to.eql(file);
    expect(file).to.eql(path.join(process.cwd(), name));
    resolver.resolve((err, contents) => {
      expect(err).to.eql(null); 
      expect(contents.toString()).to.eql(expected);
      done();
    });
  });

  it('should resolve npm:// with version', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , href = 'mock-npm-package@1.0.0'
        , resolver = new Resolver(state, 'npm://' + href);

    expect(resolver).to.be.an('object');
    const file = resolver.getCanonicalPath();

    // check acccessor
    resolver.file = file;
    expect(resolver.file).to.eql(file);
    expect(file).to.eql(href);

    resolver.resolve((err, contents) => {
      expect(err).to.eql(null); 
      expect(contents.toString()).to.eql(expected);
      done();
    });
  });

  //it('should error with missing file', function(done) {
    //const Resolver = plugin.Resolver
        //, state = getState()
        //, name = 'test/fixtures/non-existent.html'
        //, href = name
        //, resolver = new Resolver(state, href);

    //resolver.resolve((err) => {
      //function fn() {
        //throw err; 
      //} 
      //expect(fn).throws(/ENOENT/);
      //done();
    //});
  //});

});
