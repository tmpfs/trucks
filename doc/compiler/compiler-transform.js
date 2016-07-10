var trucks = require('../../src/index');

trucks(
  {
    files: ['doc/compiler/components.html'],
    selectors: require('../../defaults').selectors,
    phases: [trucks.LOAD, trucks.PARSE, trucks.TRANSFORM]
  },
  (err, state) => {
    if(err) {
      throw err; 
    }
    const transformed = state.result.transform;

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
