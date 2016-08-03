var expect = require('chai').expect
  , trucks = require('trucks-compiler')
  , expected = '<dom-module id="mock-http-resolver"></dom-module>\n';

describe('http:', function() {

  it('should resolve relative include', function(done) {
    const src = "http://localhost:3001/relative.html";
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'http-relative',
        plugins: [
          trucks.LOAD
        ],
        conf: {
          plugins: {
            load: {
              protocols: [require('../../src')]
            }
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.tree.imports[0]
            , relative = file.imports[0];

        expect(relative.contents).to.eql(expected);

        done();
      }
    );
  });

});
