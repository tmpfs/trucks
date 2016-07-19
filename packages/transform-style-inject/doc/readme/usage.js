const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['style-inject'],
    conf: {
      transforms: {
        'style-inject': {
          dir: 'src/components/css'
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
