var expect = require('chai').expect
  , babel = require('babel-core')
  , trucks = require('../../../lib');

describe('compiler:', function() {

  it('should generate AST for main template function', function(done) {
    const tpl = '<template id="x-foo"><span></span></template>';
    const res = trucks.compile(tpl);

    expect(res.main).to.be.an('object');

    const result = babel.transformFromAst(res.main);
    expect(result.code).to.eql(
      'function template(elem) {\n'
        + '  return templates[elem.tagName.toLowerCase()].call(elem, elem);\n'
        + '}'
    );

    done();
  });

});
