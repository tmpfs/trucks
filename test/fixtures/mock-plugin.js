function mock(state/*, conf*/) {
  return function plugin(state, cb) {
    cb(null, state); 
  }
}

module.exports = mock;
