const path = require('path')
  , cli = require('mkcli')
  , pkg = require('../package.json')
  , prg = cli.load(require('../doc/json/trucks.json'));

const trucks = require('..');

/**
 *  @name trucks
 *  @cli doc/cli/trucks.md
 */
function main(argv, conf, cb) {

  /* istanbul ignore if: always pass argv in test env */
  if(typeof argv === 'function') {
    cb = argv;
    argv = null;
  }

  /* istanbul ignore if: always pass conf in test env */
  if(typeof conf === 'function') {
    cb = conf;
    conf = null;
  }

  /* istanbul ignore next: always pass conf in test env */
  conf = conf || {};
  /* istanbul ignore next: never print to stdout in test env */
  conf.output = conf.output || process.stdout;
  /* istanbul ignore next: never read from stdin in test env */
  conf.input = conf.input || process.stdin;

  var opts = {
      // read from stdin before files, but be aware that file
      // information is lost so relative includes will not work as expected
      input: conf.input, 
      output: conf.output,
      serialize: true
    }
    , help = require('mkcli/plugin/help')
    , runtime = {
        base: path.normalize(path.join(__dirname, '..')),
        target: opts,
        hints: prg,
        help: {
          file: 'doc/help/trucks.txt',
          output: conf.output
        },
        version: {
          name: pkg.name,
          version: pkg.version,
          output: conf.output
        },
        plugins: [
          require('mkcli/plugin/hints'),
          require('mkcli/plugin/argv'),
          help,
          require('mkcli/plugin/version')
        ]
      };

  cli.run(prg, argv, runtime, function parsed(err, req) {
    if(err || req.aborted) {
      return cb(err); 
    }

    this.files = req.unparsed;

    trucks(this, cb);
  })
}

module.exports = main;
