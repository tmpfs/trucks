var expect = require('chai').expect
  , babel = require('babel-core')
  , trucks = require('../../../lib');

describe('compiler:', function() {

  it('should generate AST map for multiple template elements', function(done) {
    const tpl = '<template id="x-foo"><span></span></template>'
      + '<template id="x-bar"><span></span></template>';

    const res = trucks.compile(tpl);
    const result = babel.transformFromAst(res.map);
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
