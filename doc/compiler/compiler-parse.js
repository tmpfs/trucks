var trucks = require('../../src/index');

trucks(
  {
    files: ['doc/compiler/components.html'],
    selectors: require('../../defaults').selectors,
    plugins: [trucks.LOAD, trucks.PARSE]
  },
  (err, state) => {
    if(err) {
      throw err; 
    }

    console.dir(state.tree, {depth: 4});
  }
);
