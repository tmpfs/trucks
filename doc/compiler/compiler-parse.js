var trucks = require('../../lib/index');

trucks.load({files: ['doc/compiler/components.html']}, (err, loaded) => {
  if(err) {
    throw err; 
  }
  trucks.parse(loaded, (err, parsed) => {
    if(err) {
      throw err; 
    }
    console.log(JSON.stringify(parsed, undefined, 2));
  })
});
