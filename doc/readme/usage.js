const trucks = require('../../lib/index');

trucks(
  {
    files: ['doc/example/components.html'],
    transforms: ['skate'],
    out: 'target',
    force: true
  },
  (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
