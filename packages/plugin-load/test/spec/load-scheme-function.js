var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('load:', function() {

  it('should register scheme', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';

    let pluginCalled = false
      , pluginInvoked = 0
      , closureCalled = false
      , closureInvoked = 0;

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'load',
        plugins: [require('../../src')],
        conf: {
          plugins: {
            load: {
              protocols: [
                function scheme(state, conf) {
                  expect(state).to.be.an('object');
                  expect(conf).to.be.an('object');
                  pluginCalled = true;
                  pluginInvoked++;
                  return function(registry) {
                    expect(registry.register).to.be.a('function');
                    closureCalled = true;
                    closureInvoked++;
                  }
                }
              ]
            }
          }
        }
      }, (err, result) => {
        expect(err).to.eql(null);
        expect(result).to.be.an('object');

        expect(pluginCalled).to.eql(true);
        expect(pluginInvoked).to.eql(1);

        expect(closureCalled).to.eql(true);
        expect(closureInvoked).to.eql(1);

        done();
      }
    );
  });

});
