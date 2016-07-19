var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('lifecycle:', function() {

  it('should callback on node enter event', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    let visited = false
      , count = 0
      , nodes = [];

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'lifecycle-enter',
        plugins: [trucks.LOAD, trucks.PARSE, require('../../../src')],
        transforms: [
          function visit() {
            return {
              enter: (node, cb) => {
                expect(node).to.be.an('object');
                nodes.push(node);
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
        expect(state.options).to.be.an('object');
        expect(state.tree).to.be.an('object');

        expect(visited).to.eql(true);
        expect(count).to.eql(8);

        done();
      }
    );
  });

  it('should proxy error in enter function (throw)', function(done) {
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
              enter: function() {
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


});
