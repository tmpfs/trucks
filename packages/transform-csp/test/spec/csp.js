var expect = require('chai').expect
  //, fs = require('fs')
  , trucks = require('../../../../src');

describe('trim:', function() {

  it('should use default csp options', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'csp',
        transforms: [require('../../src'), 'skate/src']
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        //let expected = fs.readFileSync(
          //'../../test/expect/simple-component.js')
            //.toString().trim();

        //const js = 'target/trim.js';
        //expect(fs.readFileSync(js).toString().trim())
          //.to.eql(expected);

        //expected = fs.readFileSync(
          //'../../test/expect/simple-component.css')
            //.toString().trim();

        //const css = 'target/trim.css';
        //expect(fs.readFileSync(css).toString().trim())
          //.to.eql(expected);

        done();
      }
    );
  });

});
