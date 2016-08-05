var expect = require('chai').expect
  , babel = require('babel-core')
  , compiler = require('../../../src/compiler');

describe('compiler:', function() {

  it('should ignore invalid argument to html() (null)', function(done) {

    const tpl = '<template id="x-foo">'
      + '<span>name: ${this.tagName}</span>'
      + '<script>this.name ? html(null) : "";'
      + '</script>'
      + '</template>';

    const res = compiler.html(tpl, {literals: {text: true}});

    expect(res).to.be.an('array').to.have.length(1);

    // component id
    expect(res[0].id).to.eql('x-foo');

    // function body AST
    expect(res[0].body).to.be.an('object');

    // NOTE: this test is on the render() function not on the function body
    const result = babel.transformFromAst(res[0].render);
    expect(result.code).to.eql(
        'function render(elem) {\n'
          + '  skate.vdom.element("span", () => {\n'
          + '    skate.vdom.text(`name: ${ this.tagName }`);\n'
          + '  });\n'
          + '  this.name ? html(null) : "";\n'
          + '}' 
      );

    done();
  });

});
