var expect = require('chai').expect
  , babel = require('babel-core')
  , trucks = require('../../../lib');

describe('compiler:', function() {

  it('should generate AST for template literal (text)', function(done) {
    const tpl = '<template id="x-foo">'
      + '<span>name: ${this.tagName}</span></template>';

    const res = trucks.compile(tpl, {literals: {text: true}});

    expect(res.list).to.be.an('array').to.have.length(1);

    // component id
    expect(res.list[0].id).to.eql('x-foo');

    // function body AST
    expect(res.list[0].body).to.be.an('object');

    // NOTE: this test is on the render() function not on the function body
    const result = babel.transformFromAst(res.list[0].render);
    expect(result.code).to.eql(
      'function render(elem) {\n'
        + '  skate.vdom.element("span", () => {\n'
        + '    skate.vdom.text(`name: ${ this.tagName }`);\n'
        + '  });\n'
        + '}'
      );

    done();
  });

});
