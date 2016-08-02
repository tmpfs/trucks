const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['copy'],
    copy: {
      files: {
        'src/index.html': 'index.html'
      }
    }
  }, (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
