var mk = require('mktask')
  , path = require('path')
  , NPM = 'npm'
  , NPM_RUN = 'npm run'
  , fs = require('fs');

function dirs(cb) {
  const packages = './packages'
    , result = [];

  fs.readdir(packages, (err, dirs) => {
    if(err) {
      return cb(err); 
    } 

    dirs.forEach((name) => {
      let item = {
        file: path.join(packages, name),
        name: name
      }

      try {
        item.package = require(
          path.join(__dirname, item.file, 'package.json')) 
      }catch(e) {
        // do not add invalid project folders 
        return; 
      }

      result.push(item); 
    })

    const pkg = require('./package.json');
    result.unshift({file: './', package: pkg, name: pkg.name});
    cb(null, result);
  })
}

function script(name, packages, cb) {
  const list = packages.slice();

  let prefix = NPM_RUN
    , cmd = name;

  if(name === Object(name) && name.cmd) {
    prefix = NPM;
    cmd = name.cmd;
  }

  let exec = mk.command(prefix);

  function next(err) {
    if(err) {
      return cb(err); 
    }
    const item = list.shift(); 
    if(!item) {
      return cb(null); 
    }

    if(
      name.cmd
      || (name === String(name)
        && item.package
        && item.package.scripts
        && item.package.scripts[name])) {
      console.log('[%s %s] %s (%s)', prefix, cmd, item.name, item.file);
      exec(cmd, {cwd: item.file}, (err, stdout, stderr) => {
        if(err) {
          console.error(stdout|| ''); 
          console.error('---');
          console.error(stderr || ''); 
        } 
        next(err);
      });
    }else{
      next();
    }
  }

  next();
}

// @task install install dependencies for all packages
function install(cb) {
  dirs((err, res) => {
    if(err) { 
      return cb(err)
    }
    script({cmd: install.name}, res, cb);
  }) 
}

// @task test run tests in all packages
function test(cb) {
  dirs((err, res) => {
    if(err) { 
      return cb(err)
    }
    script(test.name, res, cb);
  }) 
}

// @task build compile all packages
function build(cb) {
  dirs((err, res) => {
    if(err) { 
      return cb(err)
    }
    script(build.name, res, cb);
  }) 
}

// @task lint style check all packages
function lint(cb) {
  dirs((err, res) => {
    if(err) { 
      return cb(err)
    }
    script(lint.name, res, cb);
  }) 
}

// @task cover style check all packages
function cover(cb) {
  dirs((err, res) => {
    if(err) { 
      return cb(err)
    }
    script(cover.name, res, cb);
  }) 
}

function doc(src, dest, opts, cb) {
  mk.doc(src)
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.toc(opts.toc))
    //.pipe(mk.ast.stringify())
    //.pipe(process.stdout)
    .pipe(mk.out())
    .pipe(mk.dest(dest))
    .on('finish', cb);
}

// @task api build the api docs.
function api(cb) {
  // build intermediary file
  const exec = require('child_process').execSync;
  exec(
    'mkapi src/index.js src/state.js src/component.js  --level=3 '
      + '> doc/api/api-docs.md');

  // build the docs
  doc('doc/api/api.md', 'doc/API.md', {toc: {depth: 2}}, cb);
}

// @task roadmap build the roadmap file
function roadmap(cb) {
  doc(
    'doc/roadmap/roadmap.md', 'doc/ROADMAP.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task options build the options file
function options(cb) {
  doc(
    'doc/options/options.md', 'doc/OPTIONS.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task developer build the developer file
function developer(cb) {
  doc(
    'doc/developer/developer.md', 'doc/DEVELOPER.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task compiler build the compiler file
function compiler(cb) {
  doc(
    'doc/compiler/compiler.md', 'doc/COMPILER.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task exmaple build the example file
function example(cb) {
  doc(
    'doc/example/example.md', 'doc/EXAMPLE.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task readme build the readme file
function readme(cb) {
  doc(
    'doc/readme.md', 'README.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task docs build all docs
function docs(cb){
  cb();
}

mk.task(install);
mk.task(lint);
mk.task(build);
mk.task(test);
mk.task(cover);

mk.task(api);
mk.task(roadmap);
mk.task(options);
mk.task(developer);
mk.task(compiler);
mk.task(example);
mk.task(readme);
mk.task([api, roadmap, options, developer, compiler, example, readme], docs)
