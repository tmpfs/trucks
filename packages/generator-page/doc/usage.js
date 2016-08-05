const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    generators: ['page'],
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
