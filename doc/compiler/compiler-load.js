var trucks = require('../../src/index');

trucks(
  {
    files: ['doc/compiler/components.html'],
    selectors: require('../../defaults').selectors,
    plugins: [trucks.LOAD]
  },
  (err, state) => {
    if(err) {
      throw err; 
    }
    console.log(JSON.stringify(state.result.load, undefined, 2));
  }
);
