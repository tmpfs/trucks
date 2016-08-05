var mk = require('mktask')
  , doc = require('../../tasks/doc')(mk);

// @task readme build the readme file
function readme(cb) {
  doc(
    'doc/readme.md', 'README.md',
    {toc: {depth: 2, max: 3}}, cb);
}

mk.task(readme);
