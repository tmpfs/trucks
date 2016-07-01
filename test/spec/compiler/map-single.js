var expect = require('chai').expect
  , babel = require('babel-core')
  , trucks = require('../../../lib');

describe('compiler:', function() {

  it('should generate AST map for template elements', function(done) {
    const tpl = '<template id="x-foo"><span></span></template>';
    const res = trucks.map(trucks.compile(tpl));

    const result = babel.transformFromAst(res);
    console.log(result.code);
    //expect(result.code).to.eql('skate.vdom.element("span");');

    done();
  });

});
