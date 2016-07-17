const trucks = require('../../lib/index');

trucks(
  {
    files: ['example/components.html'],
    transforms: ['skate'],
    out: 'target'
  },
  (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
