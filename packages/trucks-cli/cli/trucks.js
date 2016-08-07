const path = require('path')
    , fs = require('fs')
    , cli = require('mkcli-runtime')
    , pkg = require('../package.json')
    , prg = cli.load(require('../doc/json/trucks.json'))
    , TRUCKS_AUTOCONF = 'trucks.js'

/* istanbul ignore next: not going to test DEBUG mode */
const trucks = require(
        process.env.DEBUG ? 'trucks-compiler/src' : 'trucks-compiler')
    , Logger = trucks.Logger;

// override package name
pkg.name = 'trucks';

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

  /* istanbul ignore next: never pass conf in test env */
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

  var opts = {}
    , help = require('mkcli-runtime/plugin/help')
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
          require('mkcli-runtime/plugin/hints'),
          require('mkcli-runtime/plugin/argv'),
          require('mkcli-runtime/plugin/multiple'),
          help,
          require('mkcli-runtime/plugin/version')
        ]
      };

  const autoconf = path.join(process.cwd(), TRUCKS_AUTOCONF);

  cli.run(prg, argv, runtime, function parsed(err, req) {
    if(err || req.aborted) {
      return cb(err, null, this); 
    }

    let plugins = [];

    // logging options
    this.log = {};

    if(this.quiet) {
      this.log.level = Logger.NONE;
    }

    if(this.verbose) {
      this.log.level = Logger.ALL; 
    }

    this.conf = this.conf || {};

    if(this.secure !== undefined) {
      //this.conf = this.conf || {};
      this.conf.protocols = this.conf.protocols || {};
      this.conf.protocols.http = {
        secure: this.secure
      }
    }

    // manifest disabled
    if(this.manifest === false) {
      this.write = this.write || {};
      this.write.manifest = false;
    }

    // check autoconf in cwd
    try {
      let stat = fs.statSync(autoconf);
      if(stat && stat.isFile()) {
        this.rc.unshift(autoconf); 
      }
    }catch(e) {}

    // add the protocols we depend upon
    this.protocols.unshift('http', 'npm');

    /* istanbul ignore next: don't want to write to cwd in test env */
    if(!this.out) {
      this.out = process.cwd();
    }

    if(this.extract !== undefined) {
      this.after = this.after || {};
      this.after.transforms = this.after.transforms || [];
      this.conf.transforms = this.conf.transforms || {};

      // allows --extract= to defer to default output
      if(!this.extract) {
        this.extract = this.out; 
      }

      this.conf.transforms['style-extract'] = {dir: this.extract};
      this.after.transforms.push('style-extract'); 
    }

    if(this.inject !== undefined) {
      this.before = this.before || {};
      this.before.transforms = this.before.transforms || [];
      this.conf.transforms = this.conf.transforms || {};

      // allows --inject= to defer to default output
      if(!this.inject) {
        this.inject = this.out; 
      }

      this.conf.transforms['style-inject'] = {dir: this.inject};
      this.before.transforms.push('style-inject'); 
    }

    if((this.printImports || this.printTree) && this.printManifest) {
      return cb(
        new Error(
          'incompatible printers for tree and manifest, check arguments'),
        null,
        this
      ); 
    }

    if(this.printImports || this.printTree) {
      plugins = [
        this.printTree ? trucks.SOURCES : trucks.LOAD, trucks.TRANSFORM];
      this.transforms = ['tree'];
    }

    if(plugins.length) {
      this.plugins = plugins;
    }

    this.files = req.unparsed;

    this.transforms = this.transforms.reduce((prev, next) => {
      if(~next.indexOf(',')) {
        next = next.split(/\s*,\s*/); 
      }
      return prev.concat(next); 
    }, [])


    // reset transforms when empty so config file merge
    // will pick up transforms
    if(!this.transforms.length) {
      delete this.transforms; 
    }

    if(this.printManifest && this.manifest === undefined) {
      this.manifest = true; 
    }

    trucks(this, (err, state) => {
      if(err) {
        return cb(err, state, this); 
      }

      if(this.printImports || this.printTree) {
        return conf.output.write(state.result.tree.toString(), () => {
          cb(null, state, this);
        }); 
      }

      if(state.manifest) {
        var contents = JSON.stringify(state.manifest, undefined, 2) + '\n'
          , writesManifest =
              (this.manifest === String(this.manifest) && this.manifest);

        if(this.printManifest) {
          // let the manifest file write callback
          if(writesManifest) {
            conf.output.write(contents);
          // callback once the write flushes
          }else{
            return conf.output.write(contents, () => {
              cb(null, state, this); 
            });
          }
        }

        if(writesManifest) {
          var filepath = state.absolute(this.manifest);
          fs.writeFile(filepath, contents, function(err) {
            cb(err, state, this);
          });
        }else{
          cb(null, state, this);
        }
      }else{
        cb(null, state, this);
      }

    });
  })
}

main.pkg = pkg;

module.exports = main;
