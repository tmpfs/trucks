var expect = require('chai').expect
  , babel = require('babel-core')
  , compiler = require('../../../src/compiler');

describe('compiler:', function() {

  it('should generate AST for element with inline script', function(done) {
    const tpl = `<template id="x-foo">
        <script>
            if(this.foo) {
              html('<p class="foo"></p>');
            }
        </script>
        <p class="bar"></p>
      </template>`;

    const res = compiler.html(tpl);

    expect(res).to.be.an('array').to.have.length(1);

    // component id
    expect(res[0].id).to.eql('x-foo');

    // function body AST
    expect(res[0].body).to.be.an('object');

    const result = babel.transformFromAst(res[0].body);
    expect(result.code).to.eql(
      'if (this.foo) {\n' 
      + '  skate.vdom.element("p", {\n'
      + '    "class": "foo"\n'
      + '  });\n'
      + '}\n\n'
      + 'skate.vdom.element("p", {\n'
      + '  "class": "bar"\n'
      + '});');

    done();
  });

});
