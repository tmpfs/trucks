var expect = require('chai').expect
  , State = require('../../src/state');

describe('trucks:', function() {

  it('should create state with no options', function(done) {
    const state = new State();
    expect(state).to.be.an('object');
    done();
  });

});
