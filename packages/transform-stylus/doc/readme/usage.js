const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['stylus']
  }, (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
