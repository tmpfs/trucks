const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['csp'],
    conf: {
      transforms: {
        csp: {
          sha: 'sha512',
          dir: 'build/csp'
        } 
      }
    }
  }, (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
