const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['page'],
    page: {
      files: {
        'template.html': 'index.html'
      }
    }
  }, (err, state) => {
    if(err) {
      throw err; 
    }
    console.log(state);
  }
);
