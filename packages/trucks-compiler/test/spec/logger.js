var expect = require('chai').expect
  , fs = require('fs')
  , util = require('util')
  , Logger = require('../../src/logger');

describe('trucks:', function() {

  before((done) => {
    process.env.TEST_LOGGER = '1'; 
    done();
  })

  after((done) => {
    delete process.env.TEST_LOGGER; 
    done();
  })

  it('should get level integer for string (none)', function(done) {
    let res = Logger.getLevel(Logger.NONE_KEY);
    expect(res).to.eql(Logger.NONE);
    done();
  });

  it('should get level integer for string (info)', function(done) {
    let res = Logger.getLevel(Logger.INFO_KEY);
    expect(res).to.eql(60);   // 4 | 8 | 16 | 32
    done();
  });

  it('should get level integer for string (all)', function(done) {
    let res = Logger.getLevel(Logger.ALL_KEY);
    expect(res).to.eql(Logger.ALL);
    done();
  });

  it('should get level integer for integer', function(done) {
    let res = Logger.getLevel(Logger.FATAL);
    expect(res).to.eql(Logger.FATAL);
    done();
  });

  it('should get undefined on bad argument type', function(done) {
    let res = Logger.getLevel({});
    expect(res).to.eql(undefined);
    done();
  });

  it('should get undefined on bad log level string', function(done) {
    let res = Logger.getLevel('foo');
    expect(res).to.eql(undefined);
    done();
  });

  it('should log info message', function(done) {
    const stream = fs.createWriteStream('target/mock-log.log');

    function format(lvl, msg, ...params) {
      return util.format(msg, ...params) + '\n';
    }

    stream.once('open', () => {
      const log = new Logger(
        {stream: stream, format: format, level: Logger.INFO});
      expect(log).to.be.an('object');
      expect(log.info).to.be.a('function');
      expect(log.INFO).to.be.a('number');

      expect(log.getLevelName(log.INFO)).to.eql('info');
      expect(log.getInteger(log.INFO)).to.eql(log.INFO);

      // bad input is returned
      expect(log.getLevelName(2048)).to.eql(2048);

      // trigger setters
      log.stream = stream;
      log.level = Logger.INFO;

      expect(log.info()).to.eql(true);

      log.info('message %s', 'hello', () => {

        // log using default format function
        log._formatter = log.format;
        log.info('message %s', 'hello', () => {
          done();
        });
      });
    });
  });

});
