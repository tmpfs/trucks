var trucks = require('../../src/index');

trucks(
  {
    files: ['doc/compiler/components.html'],
    plugins: [trucks.LOAD],
    out: 'target',
    force: true
  },
  (err, state) => {
    if(err) {
      throw err; 
    }
    console.dir(state.tree.imports[0]);
  }
);
