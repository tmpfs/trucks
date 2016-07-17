var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should use object plugin', function(done) {
    const src = 'test/fixtures/simple-inline/components.html';

    let called = false
      , invoked = false;

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'function-plugin',
        plugins: [
          {
            plugin: function mock(state, conf) {
              expect(conf.foo).to.eql('bar');
              called = true;
              return function plugin(state, cb) {
                invoked = true;
                cb(null, state); 
              }
            },
            foo: 'bar'
          }
        ]
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
