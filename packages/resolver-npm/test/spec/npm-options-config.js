var expect = require('chai').expect
  , plugin = require('../../src')
  , expected = '<dom-module id="mock-npm-resolver"></dom-module>\n';

function getState(options) {
  const State = require('../../../../src/state');
  return new State(options);
}

describe('npm:', function() {

  before((done) => {
    process.env.PATH = 'test/bin:' + process.env.PATH; 
    done();
  });

  after((done) => {
    const exec = require('child_process').exec;
    exec('rm -rf node_modules/mock-*', done); 
  })

  it('should read compiler config from trucks.js', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'mock-options-npm-package@1.0.0'
        , href = name
        , resolver = new Resolver(state, 'npm://' + href);

    expect(resolver).to.be.an('object');

    resolver.resolve((err, contents) => {
      expect(err).to.eql(null); 
      // resolve is deferring to compiler options
      expect(contents).to.be.an('object');
      expect(contents.base).to.be.a('string');
      done();
    });
  });

  it('should ignore compiler config with parent resolver', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'mock-options-npm-package@1.0.0'
        , href = name
        , resolver = new Resolver(state, 'npm://' + href, {});

    expect(resolver).to.be.an('object');

    resolver.resolve((err, contents) => {
      expect(err).to.eql(null); 
      expect(contents.toString()).to.eql(expected);
      done();
    });
  });

});
