var expect = require('chai').expect
  , babel = require('babel-core')
  , trucks = require('../../../lib');

describe('compiler:', function() {

  it('should generate AST for element with data-static-nonce attribute',
    function(done) {
      const tpl = '<template id="x-foo">'
        + '<style data-static-nonce="UID"></style></template>';

      const res = trucks.compile(tpl);

      expect(res.list).to.be.an('array').to.have.length(1);

      // component id
      expect(res.list[0].id).to.eql('x-foo');

      // function body AST
      expect(res.list[0].body).to.be.an('object');

      const result = babel.transformFromAst(res.list[0].body);
      expect(result.code).to.eql('skate.vdom.element("style", {\n'
        + '  "statics": {\n'
        + '    "nonce": "UID"\n'
        + '  }\n'
        + '});');

      done();
    }
  );

});
