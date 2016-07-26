var expect = require('chai').expect
  , babel = require('babel-core')
  , compiler = require('../../../src/compiler');

describe('compiler:', function() {

  it('should generate AST map for multiple template elements', function(done) {
    const tpl = '<template id="x-foo"><span></span></template>'
      + '<template id="x-bar"><span></span></template>';

    const templates = compiler.html(tpl);

    const result = babel.transformFromAst(compiler.map(templates));
    expect(result.code).to.eql(
      'const templates = {\n'
        + '  "x-foo": function render(elem) {\n'
        + '    skate.vdom.element("span");\n'
        + '  },\n'
        + '  "x-bar": function render(elem) {\n'
        + '    skate.vdom.element("span");\n'
        + '  }\n'
        + '};'
    );

    done();
  });

});
