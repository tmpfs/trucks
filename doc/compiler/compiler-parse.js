var trucks = require('../../src/index');

trucks(
  {
    files: ['doc/compiler/components.html'],
    selectors: require('../../defaults').selectors,
    phases: [trucks.LOAD, trucks.PARSE]
  },
  (err, state) => {
    if(err) {
      throw err; 
    }
    console.log(JSON.stringify(state.result.parse, undefined, 2));
  }
);
