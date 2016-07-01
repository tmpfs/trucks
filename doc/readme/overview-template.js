const fs = require('fs')
  , babel = require('babel-core')
  , contents = fs.readFileSync('doc/readme/overview-template.html').toString()
  , trucks = require('../../lib');

const compiled = trucks.compile(contents, {literals: {text: true}});
console.log(babel.transformFromAst(compiled.list[0].render).code);
