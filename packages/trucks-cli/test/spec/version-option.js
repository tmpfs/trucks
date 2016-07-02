var expect = require('chai').expect
  , fs = require('fs')
  , cli = require('../../cli/trucks');

describe('trucks-cli:', function() {

  it('should print version', function(done) {
    var argv = ['--version']
      , target = 'target/trucks-version.txt'
      , conf = {
          output: fs.createWriteStream(target)
        };

    cli(argv, conf, function(err) {
      expect(err).to.eql(null);
      var contents = '' + fs.readFileSync(target);
      expect(contents).to.eql(cli.pkg.name + ' ' + cli.pkg.version + '\n');
      done();
    })
  });
});

