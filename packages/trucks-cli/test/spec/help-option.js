var expect = require('chai').expect
  , fs = require('fs')
  , cli = require('../../cli/trucks');

describe('cli:', function() {

  it('should print program help', function(done) {

    var argv = ['-h']
      , target = 'target/trucks-help.txt'
      , conf = {
          output: fs.createWriteStream(target)
        };
    cli(argv, conf, function(err) {
      expect(err).to.eql(null);
      var contents = '' + fs.readFileSync(target)
        , re = new RegExp('^Usage: ' + cli.pkg.name);
      expect(re.test(contents)).to.eql(true);
      done();
    })
  });

});
