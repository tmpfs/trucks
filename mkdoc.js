var mk = require('mktask')
  , path = require('path')
  , NPM = 'npm'
  , NPM_RUN = 'npm run'
  , doc = require('./tasks/doc')(mk)
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

    //const pkg = require('./package.json');
    //result.unshift({file: './', package: pkg, name: pkg.name});
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

// @task install install dependencies
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

// @task cover generate code coverage
function cover(cb) {
  dirs((err, res) => {
    if(err) { 
      return cb(err)
    }
    script(cover.name, res, cb);
  }) 
}

mk.task(install);
mk.task(lint);
mk.task(build);
mk.task(test);
mk.task(cover);

// @task manual build the manual docs
function manual(cb) {
  doc(
    'documents/manual.md', 'manual/README.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task introduction build the introduction docs
function introduction(cb) {
  doc(
    'documents/introduction.md', 'manual/introduction.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task components build the components docs
function components(cb) {
  doc(
    'documents/components.md', 'manual/components.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task plugins build the plugins docs
function plugins(cb) {
  doc(
    'documents/plugins.md', 'manual/plugins.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task transforms build the transforms docs
function transforms(cb) {
  doc(
    'documents/transforms.md', 'manual/transforms.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task developer build the developer docs
function developer(cb) {
  doc(
    'documents/developer.md', 'manual/developer.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task readme build the readme docs
function readme(cb) {
  doc(
    'documents/readme.md', 'README.md',
    {toc: {depth: 2, max: 3}}, cb);
}

// @task docs build all docs
function docs(cb) {cb();}

mk.task(manual);
mk.task(introduction);
mk.task(components);
mk.task(plugins);
mk.task(transforms);
mk.task(developer);
mk.task(readme);
mk.task([
  components,
  developer,
  introduction,
  plugins,
  transforms,
  manual,
  readme
], docs);
