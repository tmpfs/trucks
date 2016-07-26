const babel = require('babel-core')
  , compiler = require('../../src/compiler');

console.log(babel.transformFromAst(compiler.main()).code);
