var expect = require('chai').expect
  , trucks = require('trucks-compiler')
  , expected = 'var foo = \'bar\';\n';

describe('http:', function() {

  it('should resolve relative include with relative script', function(done) {
    const src = "http://localhost:3001/relative-script.html";
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'http-relative',
        plugins: [
          trucks.LOAD, trucks.PARSE
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
            , relative = file.imports[0]
            , script = relative.modules[0].javascript[0];

        expect(script.contents).to.eql(expected);

        done();
      }
    );
  });

});
