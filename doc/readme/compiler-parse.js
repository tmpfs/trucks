var trucks = require('../../lib/index');

trucks.load({files: ['example/compiler/components.html']}, (err, res) => {
  if(err) {
    throw err; 
  }
  trucks.parse(res, (err, parsed) => {
    if(err) {
      throw err; 
    }
    console.log(JSON.stringify(parsed, undefined, 2));
  })
});
