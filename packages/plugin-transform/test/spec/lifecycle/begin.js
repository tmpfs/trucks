var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('lifecycle:', function() {

  it('should callback on begin event', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    let visited = false
      , count = 0;

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'transform-plugin-begin',
        plugins: [trucks.LOAD, trucks.PARSE, require('../../../src')],
        transforms: [
          function visit() {
            return {
              begin: function(node, cb) {
                expect(node).to.be.an('object');
                visited = true;
                count++;
                cb(null, node);
              }
            }
          }
        ]
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(visited).to.eql(true);
        expect(count).to.eql(1);

        expect(state.options).to.be.an('object');
        expect(state.tree).to.be.an('object');
        done();
      }
    );
  });

  it('should proxy error in begin function (throw)', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'transform-plugin-begin-error-throw',
        plugins: [trucks.LOAD, trucks.PARSE, require('../../../src')],
        transforms: [
          function visit() {
            return {
              begin: function() {
                throw new Error('mock error');
              }
            }
          }
        ]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/mock error/);
        done();
      }
    );
  });

  it('should proxy error in begin function (callback)', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'transform-plugin-begin-error-callback',
        plugins: [trucks.LOAD, trucks.PARSE, require('../../../src')],
        transforms: [
          function visit() {
            return {
              begin: function(node, cb) {
                return cb(new Error('mock error'));
              }
            }
          }
        ]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/mock error/);
        done();
      }
    );
  });

});
