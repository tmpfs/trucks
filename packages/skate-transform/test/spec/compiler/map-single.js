var expect = require('chai').expect
  , babel = require('babel-core')
  , compiler = require('../../../src/compiler');

describe('compiler:', function() {

  it('should generate AST map for template element', function(done) {
    const tpl = '<template id="x-foo"><span></span></template>';

    const res = compiler.html(tpl);

    const result = babel.transformFromAst(res.map);
    expect(result.code).to.eql(
      'const templates = {\n'
        + '  "x-foo": function render(elem) {\n'
        + '    skate.vdom.element("span");\n'
        + '  }\n'
        + '};'
    );

    done();
  });

});
