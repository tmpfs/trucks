var expect = require('chai').expect
  , State = require('../../../../packages/trucks-compiler/src/state')
  , Resolver = require('../../src');

describe('resolver:', function() {

  it('should create resolver with href', function(done) {
    const href = 'file.html'
        , resolver = new Resolver(new State({}), href);
    expect(resolver).to.be.an('object')

    expect(resolver.href).to.eql(href);
    expect(resolver.file).to.eql(href);

    // test setter
    resolver.file = href;
    expect(resolver.file).to.eql(href);
    expect(resolver.protocol).to.eql(null);

    done();
  });

  it('should lookup protocol in parent', function(done) {
    const parent = new Resolver(new State({}), 'http://example.com')
        , href = 'file.html'
        , resolver = new Resolver(new State({}), href, parent);

    expect(resolver).to.be.an('object')

    expect(resolver.protocol).to.eql('http:');

    done();
  });

  it('should callback on resolve', function(done) {
    const href = 'file.html'
        , resolver = new Resolver(new State({}), href);
    expect(resolver).to.be.an('object')
    resolver.resolve(done);
  });

  it('should throw url parse error with no href', function(done) {
    function fn() {
      new Resolver(new State({}));
    }
    expect(fn).throws(TypeError);
    done();
  });

});
