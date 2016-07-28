const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['bundle'],
    conf: {
      transforms: {
        bundle: {
          css: ['styles.css'],
          js: ['app.js']
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
