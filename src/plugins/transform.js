function plugin(/*conf, state*/) {

  return function transform(state, cb) {
    cb();
  }

}

module.exports = plugin;
