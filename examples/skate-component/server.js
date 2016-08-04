const express = require('express')
  , fs = require('fs')
  , config = fs.readFileSync(__dirname + '/build/csp.txt').toString()
  , app = express();

app.get('*', (req, res, next) => {
  const policy = "default-src 'self'; " + config;
  res.set('Content-Security-Policy', policy);
  next();
});

app.use(express.static(__dirname + '/build'));

app.listen(process.env.PORT || 3000);

