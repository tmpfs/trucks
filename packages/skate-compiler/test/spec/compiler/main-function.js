var expect = require('chai').expect
  , babel = require('babel-core')
  , compiler = require('../../../src/compiler');

describe('compiler:', function() {

  it('should generate AST for main template function', function(done) {
    const tpl = '<template id="x-foo"><span></span></template>';

    const main = compiler.main();

    expect(main).to.be.an('object');

    const result = babel.transformFromAst(main);
    expect(result.code).to.eql(
      'function template(elem) {\n'
        + '  return templates[elem.tagName.toLowerCase()].call(elem, elem);\n'
        + '}'
    );

    done();
  });

});
