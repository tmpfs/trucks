var trucks = require('../../src');

trucks(
  require('./options'),
  (err) => {
    if(err) {
      throw err; 
    }
  }
);
