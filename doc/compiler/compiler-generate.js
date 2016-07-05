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

            trucks.generate(transformed, (err, generated) => {
              if(err) {
                throw err; 
              }

              // NOTE: extract only relevant data for example output
              const result = {
                stylesheet: generated.stylesheet,
                javascript: generated.javascript
              }

              console.log(JSON.stringify(result, undefined, 2));
            });
          }
        );
      }
    )
  }
);
