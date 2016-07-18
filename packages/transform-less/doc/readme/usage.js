const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['less'],
    conf: {
      transforms: {
        less: {
          paths: [process.cwd()]
        }
      }
    }
  }, (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
