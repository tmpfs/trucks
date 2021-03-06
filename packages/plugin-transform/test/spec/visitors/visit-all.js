var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('transform:', function() {

  it('should visit all nodes', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    let visited = false
      , count = 0
      , nodes = [];

    trucks(
      {
        files: [src],
        out: 'target',
        name: 'transform-plugin',
        plugins: [trucks.LOAD, trucks.PARSE, require('../../../src')],
        transforms: [
          function visit() {
            return {
              '*': function(node, cb) {
                expect(node).to.be.an('object');
                nodes.push(node);
                visited = true;
                count++;
                cb(null, node);
              }
            }
          }
        ]
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(visited).to.eql(true);
        expect(count).to.eql(8);

        const components = state.components
            , Tree = components.Tree
            , File = components.File
            , Module = components.Module
            , Component = components.Component
            , Template = components.Template
            , Style = components.Style
            , Script = components.Script;

        expect(nodes[0]).to.be.instanceof(Tree);
        expect(nodes[1]).to.be.instanceof(File);
        expect(nodes[2]).to.be.instanceof(File);
        expect(nodes[3]).to.be.instanceof(Module);
        expect(nodes[4]).to.be.instanceof(Component);
        expect(nodes[5]).to.be.instanceof(Template);
        expect(nodes[6]).to.be.instanceof(Style);
        expect(nodes[7]).to.be.instanceof(Script);

        expect(state.options).to.be.an('object');
        expect(state.tree).to.be.an('object');
        done();
      }
    );
  });

});
