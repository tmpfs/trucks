const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['example/components.html'],
    transforms: ['trim']
  }, (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
