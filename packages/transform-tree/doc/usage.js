const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['components.html'],
    transforms: ['tree'],
    conf: {
      transforms: {
        tree: {
          label: (tag, id) => {
            return tag + '#' + id; 
          }
        }
      }
    }
  }, (err, state) => {
    if(err) {
      throw err; 
    }
    console.log(state.result.tree.toString());
  }
);
