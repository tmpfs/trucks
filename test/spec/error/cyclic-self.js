var expect = require('chai').expect
  , path = require('path')
  , trucks = require('../../../src');

describe('trucks:', function() {

  it('should error on load with cyclic dependency (self)', function(done) {
    trucks(
      {
        files: [
          // NOTE: use absolute path to trigger code path
          path.join(
            process.cwd(),
            'test/fixtures/cyclic-self/components.html'
          )
        ]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/cyclic dependency detected/);
        done();
      }
    );
  });

});
