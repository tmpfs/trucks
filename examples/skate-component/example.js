var trucks = require('trucks');

trucks(
  require('./options'),
  (err) => {
    if(err) {
      throw err; 
    }
  }
);
