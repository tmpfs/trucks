var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should use before plugin function', function(done) {
    const src = 'test/fixtures/simple-inline/components.html'
        , config = {
            foo: 'bar'
          };

    let called = false
      , invoked = false;

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'before-plugin-function',
        before: {
          plugins: [
            function mock(state, conf) {
              expect(conf).to.eql(config);
              called = true;
              return function plugin(state, cb) {
                invoked = true;
                cb(null, state); 
              }
            }
          ]
        },
        conf: {
          plugins: {
            mock: config
          }
        }
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        expect(state.options).to.be.an('object');
        expect(state.tree).to.be.an('object');

        expect(called).to.eql(true);
        expect(invoked).to.eql(true);
        done();
      }
    );
  });

});
