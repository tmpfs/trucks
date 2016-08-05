const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['sass'],
    conf: {
      transforms: {
        sass: {
          includePaths: [process.cwd()]
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
