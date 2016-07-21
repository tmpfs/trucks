const port = process.env.PORT || 3001;

function server(cb) {
  const express = require('express')
    , app = express();

  app.use(express.static(__dirname + '/fixtures'));
  app.listen(port, cb);
}

if(!module.parent) {
  server((err) => {
    if(err) {
      throw err; 
    } 
  });
}

module.exports = server;
