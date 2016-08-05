const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['style-extract'],
    conf: {
      transforms: {
        'style-extract': {
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
