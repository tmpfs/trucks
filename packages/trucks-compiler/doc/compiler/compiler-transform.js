var trucks = require('../../src/index');

trucks(
  {
    files: ['doc/compiler/components.html'],
    plugins: [trucks.LOAD, trucks.PARSE, trucks.TRANSFORM],
    transforms: ['trim', 'skate/src'],
    out: 'target',
    force: true
  },
  (err, state) => {
    if(err) {
      throw err; 
    }
    console.dir(state.output, {depth: 4});
  }
);
