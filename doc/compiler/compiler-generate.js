var trucks = require('../../lib/index');

trucks(
  {
    files: ['doc/compiler/components.html'],
    selectors: require('../../defaults').selectors,
    phases: [
      trucks.phases.LOAD,
      trucks.phases.PARSE,
      trucks.phases.TRANSFORM,
      trucks.phases.GENERATE
    ]
  }, 
  (err, state) => {
    if(err) {
      throw err; 
    }

    const generated = state.result.generate;

    // NOTE: extract only relevant data for example output
    const result = {
      stylesheet: generated.stylesheet,
      javascript: generated.javascript
    }

    console.log(JSON.stringify(result, undefined, 2));
  }
);
