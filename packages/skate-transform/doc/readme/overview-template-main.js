//const fs = require('fs')
const babel = require('babel-core')
  //, contents = fs.readFileSync('doc/readme/overview-template.html').toString()
  , compiler = require('../../src/compiler');

console.log(babel.transformFromAst(compiler.main()).code);
