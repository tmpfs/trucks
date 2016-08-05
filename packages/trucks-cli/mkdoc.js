var fs = require('fs')
  , mk = require('mktask')
  , doc = require('../../tasks/doc')(mk);

function info() {
  var programs = fs.readdirSync('bin')
    , map = {}
    , names = {};
  programs.forEach(function(name) {
    map[name] = require('./package.json')
    names[name] = name;
  })
  return {packages: map, names: names};
}

function bin(type, src, out, cb) {
  var detail = info()
    , opts = {
        files: [src],
        type: type,
        dest: {},
        pi: [mk.cli.MAN],
        newline: false,
        footer: true,
        packages: detail.packages,
        names: detail.names
      };

  if(type === mk.cli.HELP) {
    opts.summarize = true;
    opts.desc = 0;
  }

  opts.dest[type] = out;
  mk.exe(opts, cb);
}

// @task json build the cli descriptor files
function json(cb) {
  bin(mk.cli.JSON, 'doc/cli', 'doc/json', cb);
}

// @task help build the help files
function help(cb) {
  bin(mk.cli.HELP, 'doc/cli', 'doc/help', cb);
}

// @task man build the man pages
function man(cb) {
  bin(mk.cli.MAN, 'doc/cli', 'doc/man', cb);
}

// @task zsh build the zsh completion files
function zsh(cb) {
  bin(mk.cli.ZSH, 'doc/cli', 'doc/zsh', cb);
}

// @task cli build all command line interface files
function cli() {
  return [json, help, man, zsh];
}

// @task readme build the readme file
function readme(cb) {
  doc(
    'doc/readme.md', 'README.md',
    {toc: {depth: 2, max: 3}}, cb);
}

mk.task(json);
mk.task(help);
mk.task(man);
mk.task(zsh);
mk.task(cli);
mk.task(readme);
