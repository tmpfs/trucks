var trucks = require('../../lib/index');

trucks.load({files: ['example/compiler/components.html']}, (err, loaded) => {
  if(err) {
    throw err; 
  }
  console.log(JSON.stringify(loaded, undefined, 2));
});
