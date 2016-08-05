var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('generate:', function() {

  it('should use generator plugin', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';

    let called = 0;

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'generate-plugin',
        plugins: [trucks.SOURCES, trucks.TRANSFORM, require('../../src')],
        generators: [function(/*state, conf*/) {
          return (state, cb) => {
            called++;
            cb(); 
          } 
        }]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');
        expect(called).to.eql(1);
        done();
      }
    );
  });

  it('should proxy generator plugin error (callback)', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'generate-plugin',
        plugins: [trucks.SOURCES, trucks.TRANSFORM, require('../../src')],
        generators: [function(/*state, conf*/) {
          return (state, cb) => {
            cb(new Error('mock error'));
          } 
        }]
      }, (err) => {
        function fn() {
          throw err; 
        }
        expect(fn).throws(/mock error/);
        done();
      }
    );
  });

  it('should proxy generator plugin error (throws)', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'generate-plugin',
        plugins: [trucks.SOURCES, trucks.TRANSFORM, require('../../src')],
        generators: [function(/*state, conf*/) {
          return (/*state, cb*/) => {
            throw new Error('mock error');
          } 
        }]
      }, (err) => {
        function fn() {
          throw err; 
        }
        expect(fn).throws(/mock error/);
        done();
      }
    );
  });

});
