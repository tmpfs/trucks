var expect = require('chai').expect
  , babel = require('babel-core')
  , compiler = require('../../../src/compiler');

describe('compiler:', function() {

  it('should generate AST for inline style', function(done) {
    const tpl = '<template id="x-foo">'
      + '<style>span {color: red;}</style>'
      + '<span></span></template>';

    const res = compiler.html(tpl);

    expect(res).to.be.an('array').to.have.length(1);

    // component id
    expect(res[0].id).to.eql('x-foo');

    // function body AST
    expect(res[0].body).to.be.an('object');

    const result = babel.transformFromAst(res[0].body);
    expect(result.code).to.eql(
      'skate.vdom.element("style", () => {\n'
        + '  skate.vdom.text("span {color: red;}");\n'
        + '});\n'
        + 'skate.vdom.element("span");');

    done();
  });

});
