var trucks = require('../../lib/index');

trucks.load({files: ['example/compiler/components.html']}, (err, loaded) => {
  if(err) {
    throw err; 
  }
  trucks.parse(loaded, (err, parsed) => {
    if(err) {
      throw err; 
    }
    trucks.transform(parsed, (err, transformed) => {
      if(err) {
        throw err; 
      }

      // remove irrelevant info for this example output
      delete transformed.css;
      delete transformed.tpl;

      // clean circular references
      transformed.js.forEach((script) => {
        delete script.result;
        delete script.components;
      })

      console.log(JSON.stringify(transformed, undefined, 2));
    });
  })
});
