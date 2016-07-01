const fs = require('fs')
  , babel = require('babel-core')
  , contents = fs.readFileSync('doc/readme/overview-template.html').toString()
  , trucks = require('../../lib');

const compiled = trucks.compile(contents, {literals: {text: true}});
process.stdout.write(babel.transformFromAst(compiled[0].render).code);
