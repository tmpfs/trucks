var trucks = require('../../lib/index');

trucks.load({files: ['example/compiler/components.html']}, (err, res) => {
  if(err) {
    throw err; 
  }
  console.log(JSON.stringify(res, undefined, 2));
});
