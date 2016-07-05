var trucks = require('../../lib/index');

trucks.load(
  {
    files: ['doc/compiler/components.html'],
    selectors: require('../../defaults').selectors
  },
  (err, loaded) => {
    if(err) {
      throw err; 
    }
    trucks.parse(
      loaded, 
      require('../../defaults'),
      (err, parsed) => {
        if(err) {
          throw err; 
        }
        trucks.transform(
          parsed,
          require('../../defaults'),
          (err, transformed) => {
            if(err) {
              throw err; 
            }

            // remove irrelevant info for this example output
            delete transformed.css;
            delete transformed.tpl;
            delete transformed.compiled;

            // clean circular references
            transformed.js.forEach((script) => {
              delete script.result;
              delete script.components;
            })

            console.log(JSON.stringify(transformed, undefined, 2));
          }
        );
      }
    )
  }
);
