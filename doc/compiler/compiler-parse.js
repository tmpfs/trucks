var trucks = require('../../lib/index');

trucks(
  {
    files: ['doc/compiler/components.html'],
    selectors: require('../../defaults').selectors,
    phases: [trucks.phases.LOAD, trucks.phases.PARSE]
  },
  (err, state) => {
    if(err) {
      throw err; 
    }
    console.log(JSON.stringify(state.result.parse, undefined, 2));
  }
);
