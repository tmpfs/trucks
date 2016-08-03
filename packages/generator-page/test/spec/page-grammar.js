var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('page:', function() {

  it('should proxy grammar function error (callback)', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        force: true,
        generators: [require('../../src')],
        page: {
          files: {
            'test/fixtures/mock-page.html': 'mock-page.html'
          },
          grammar: {
            file: (state, tag, instr, cb) => {
              cb(new Error('mock error')); 
            }
          }
        }
      }, (err) => {
        function fn() {
          throw err; 
        }
        expect(fn).throws(/mock error/);
        done();
      }
    );
  });

  it('should proxy grammar function error (throws)', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        force: true,
        generators: [require('../../src')],
        page: {
          files: {
            'test/fixtures/mock-page.html': 'mock-page.html'
          },
          grammar: {
            file: (/*state, tag, instr, cb */) => {
              throw new Error('mock error'); 
            }
          }
        }
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
