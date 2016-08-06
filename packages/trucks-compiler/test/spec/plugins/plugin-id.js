var expect = require('chai').expect
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should use plugin function with id', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';

    let called = false
      , invoked = false;

    function plugin(state, conf) {
      expect(conf.foo).to.eql('bar');
      called = true;
      return function plugin(state, cb) {
        invoked = true;
        cb(null, state); 
      }
    }

    plugin.id = 'mock';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'plugin-id',
        plugins: [plugin],
        conf: {
          plugins: {
            mock: {
              foo: 'bar'
            }
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
