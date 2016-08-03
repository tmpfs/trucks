var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('transform:', function() {

  it('should use after transform function', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
        , config = {
            foo: 'bar'
          };

    let called = false
      , invoked = false;

    trucks(
      {
        files: [src],
        plugins: [trucks.LOAD, trucks.PARSE, require('../../../src')],
        out: 'target',
        name: 'after-plugin-function',
        after: {
          transforms: [
            function mock(state, conf) {
              expect(conf).to.eql(config);
              called = true;
              return {
                'Module': function(node, cb) {
                  expect(node).to.be.an('object')
                  invoked = true;
                  cb();
                }
              };
            }
          ]
        },
        conf: {
          transforms: {
            mock: config
          }
        }
      },
      (err, state) => {
        console.dir(err);
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
