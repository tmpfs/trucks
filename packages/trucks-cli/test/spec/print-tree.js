var expect = require('chai').expect
  , fs = require('fs')
  , cli = require('../../cli/trucks');

describe('cli:', function() {

  it('should print component tree', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target'
      , file = 'target/print-tree.log';

    const stream = fs.createWriteStream(file);

    stream.once('open', () => {
      cli(
        [
          '--force',
          '--print-tree',
          '--out=' + out,
          src
        ],
        {
          output: stream 
        },
        (err, state) => {
          expect(err).to.eql(null);
          expect(state).to.be.an('object');
          expect(fs.statSync(file).size).to.be.gt(0);
          done();
        }
      );
    });
  });

});
