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

      // NOTE: as we now have the AST injected there are circular references

      //console.log(JSON.stringify(transformed, undefined, 2));
    });
  })
});
