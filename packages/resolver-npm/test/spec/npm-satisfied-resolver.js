var expect = require('chai').expect
  //, path = require('path')
  , plugin = require('../../src')
  , expected = '<dom-module id="mock-npm-resolver"></dom-module>\n';

function getState(options) {
  const State = require('../../../../packages/trucks-compiler/src/state');
  return new State(options);
}

describe('npm:', function() {

  before((done) => {
    const exec = require('child_process').exec;
    process.env.PATH = 'test/bin:' + process.env.PATH; 
    exec('cp -rf test/fixtures/mock-npm-package node_modules', done); 
  });

  after((done) => {
    const exec = require('child_process').exec;
    exec('rm -rf node_modules/mock-*', done); 
  })

  it('should satisfy dependency with existing package', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'mock-npm-package@1.0.0'
        , href = name
        , resolver = new Resolver(state, 'npm://' + href);

    expect(resolver).to.be.an('object');

    resolver.resolve((err, contents) => {
      expect(err).to.eql(null); 
      expect(contents.toString()).to.eql(expected);
      done();
    });
  });

  // trigger a re-install of the package as existing install package
  // does not satisfy the semver spec
  it('should re-install dependency with existing package', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'mock-npm-package@2.0.0'
        , href = name
        , resolver = new Resolver(state, 'npm://' + href);

    expect(resolver).to.be.an('object');

    resolver.resolve((err, contents) => {
      expect(err).to.eql(null); 
      expect(contents.toString()).to.eql(expected);
      done();
    });
  });

});
