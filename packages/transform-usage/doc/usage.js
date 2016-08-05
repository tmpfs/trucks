const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['usage'],
    usage: {
      main: false,
      files: true
    }
  }, (err, state) => {
    if(err) {
      throw err; 
    }
    console.log(state);
  }
);
