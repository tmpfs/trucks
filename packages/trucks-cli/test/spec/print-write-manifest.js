var expect = require('chai').expect
  , fs = require('fs')
  , cli = require('../../cli/trucks');

describe('cli:', function() {

  it('should print and write manifest file', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , out = 'target'
      , file = 'target/write-manifest.json';

    const stream = fs.createWriteStream(file);

    stream.once('open', () => {
      cli(
        [
          '--force',
          '--print-manifest',
          '--manifest=' + file,
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
