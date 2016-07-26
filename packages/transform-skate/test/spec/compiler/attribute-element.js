var expect = require('chai').expect
  , babel = require('babel-core')
  , compiler = require('../../../src/compiler');

describe('compiler:', function() {

  it('should generate AST for element with attributes', function(done) {
    const tpl = '<template id="x-foo">'
      + '<span id="myid" class="inline"></span></template>';

    const res = compiler.html(tpl);

    expect(res).to.be.an('array').to.have.length(1);

    // component id
    expect(res[0].id).to.eql('x-foo');

    // function body AST
    expect(res[0].body).to.be.an('object');

    const result = babel.transformFromAst(res[0].body);
    expect(result.code).to.eql('skate.vdom.element("span", {\n'
      + '  "id": "myid",\n'
      + '  "class": "inline"\n'
      + '});');

    done();
  });

});
