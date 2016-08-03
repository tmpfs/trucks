var expect = require('chai').expect
  , plugin = require('../../src');

function getState(options) {
  const State = require('../../../../packages/trucks-compiler/src/state');
  return new State(options);
}

describe('npm:', function() {

  let PATH;

  before((done) => {
    PATH = process.env.PATH;
    process.env.PATH = ''; 
    done();
  });


  after((done) => {
    process.env.PATH = PATH;
    const exec = require('child_process').exec;
    exec('rm -rf node_modules/mock-*', done); 
  })

  it('should error on command not found', function(done) {
    const Resolver = plugin.Resolver
        , state = getState()
        , name = 'mock-main-npm-package@1.0.0'
        , href = name
        , resolver = new Resolver(state, 'npm://' + href);

    expect(resolver).to.be.an('object');

    resolver.resolve((err) => {
      function fn() {
        throw err; 
      }
      expect(fn).throws(/command failed/i);
      done();
    });
  });

});
