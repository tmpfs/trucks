var trucks = require('../../src/index');

trucks(
  require('./options'),
  (err) => {
    if(err) {
      throw err; 
    }
  }
);
