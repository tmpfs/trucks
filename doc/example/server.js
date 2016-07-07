const express = require('express')
  , app = express();

app.get('*', (req, res, next) => {
  const policy = "default-src 'self'; style-src 'self' 'unsafe-inline'";
  res.set('Content-Security-Policy', policy);
  next();
});

app.use(express.static(__dirname));

app.listen(process.env.PORT || 3000);

