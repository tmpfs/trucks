var mk = require('mktask')
  , doc = require('../../tasks/doc')(mk);

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

mk.task(readme);
mk.task([readme], docs)
