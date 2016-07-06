var trucks = require('../../lib/index');

trucks(
  require('./options'),
  (err) => {
    if(err) {
      throw err; 
    }
  }
);
