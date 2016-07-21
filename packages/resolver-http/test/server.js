const port = process.env.PORT || 3001;

function server(cb) {
  const express = require('express')
    , fs = require('fs')
    , zlib = require('zlib')
    , app = express();

  app.use(express.static(__dirname + '/fixtures'));

  app.get('/components.html.tgz', (req, res) => {
    const file = __dirname + '/fixtures/components.html' 
        , buf = fs.readFileSync(file)
        , compressed = zlib.gzipSync(buf);

    res.set('content-type', 'text/html');
    res.set('content-encoding', 'gzip');
    res.set('content-length', compressed.length);

    res.end(compressed);
  });

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
