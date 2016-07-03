var trucks = require('../../lib/index');

trucks.load(
  {
    files: ['doc/compiler/components.html'],
    selectors: require('../../defaults').selectors
  },
  (err, loaded) => {
    if(err) {
      throw err; 
    }
    console.log(JSON.stringify(loaded, undefined, 2));
  }
);
