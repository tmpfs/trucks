var trucks = require('../../index');

trucks({files: ['test/fixtures/components.html']}, (err, res) => {
  if(err) {
    throw err; 
  }
  console.log(res);
});
