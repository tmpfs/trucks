const path = require('path')
  , cli = require('mkcli')
  , pkg = require('../package.json')
  , prg = cli.load(require('../doc/json/trucks.json'))
  , trucks = require('trucks');

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

  var opts = {
    }
    , help = require('mkcli/plugin/help')
    , runtime = {
        base: path.normalize(path.join(__dirname, '..')),
        target: opts,
        hints: prg,
        multiple: prg,
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
          require('mkcli/plugin/multiple'),
          help,
          require('mkcli/plugin/version')
        ]
      };

  cli.run(prg, argv, runtime, function parsed(err, req) {
    if(err || req.aborted) {
      return cb(err); 
    }

    this.files = req.unparsed;

    // no stylesheet file path specified, use `components.css` in cwd
    if(!this.css) {
      this.css = path.join(process.cwd(), 'components.css');
    }

    // no javascript file path specified, use `components.js` in cwd
    if(!this.js) {
      this.js = path.join(process.cwd(), 'components.js');
    }

    trucks(this, cb);
  })
}

module.exports = main;
