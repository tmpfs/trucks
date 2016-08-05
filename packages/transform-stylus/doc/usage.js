const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['stylus'],
    conf: {
      transforms: {
        stylus: {
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
