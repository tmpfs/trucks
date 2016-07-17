const trucks = require('../../lib/index');

trucks(
  {
    files: ['example/components.html'],
    transforms: ['skate']
  },
  (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
