var mk = require('mktask')
  , doc = require('../../tasks/doc')(mk);

// @task build compile the component
function build(cb) {
  mk.exec('npm run build', cb);
}

// @task readme build the readme file
function readme(cb) {
  doc(
    'example.md', 'README.md',
    {toc: {depth: 2, max: 3}}, cb);
}

mk.task(build);
mk.task(readme);
