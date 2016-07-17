var trucks = require('../../src/index');

trucks(
  {
    files: ['doc/compiler/components.html'],
    selectors: require('../../defaults').selectors,
    plugins: [
      trucks.LOAD,
      trucks.PARSE,
      trucks.TRANSFORM,
      trucks.GENERATE
    ],
    transforms: ['trim', 'skate/src']
  }, 
  (err, state) => {
    if(err) {
      throw err; 
    }

    console.dir(state.output);
  }
);
