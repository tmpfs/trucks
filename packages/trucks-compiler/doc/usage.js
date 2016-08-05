const trucks = require('../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['skate'],
    out: 'target',
    force: true
  },
  (err, state) => {
    if(err) {
      throw err; 
    }
    console.log(state);
  }
);
