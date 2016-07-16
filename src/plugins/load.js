const fs = require('fs')
    , path = require('path');

/**
 *  Encapsulates the load state information.
 *
 *  @private {constructor} LoadState
 *  @param {Object} input compiler state input object.
 *  @param {Array} output list for the output result objects.
 *  @param {Object} opts processing options.
 */
function LoadState(input, output) {
  
  this.input = input;
  this.output = output;

  // TODO: prefer `output` property
  this.out = output;

  this.parser = input.parser;
  this.opts = input.options;
  // source input files passed to be loaded
  this.files = input.files;

  // list of parent file hierarchies used to detect circular imports
  this.hierarchy = [];


  // pass reference to component tree into load state
  this.tree = input.tree;

  // list of component files that have been processed used to prevent
  // duplication compilation when multiple components share the same
  // dependency, proxied from the compiler state so it applies to all
  // source files
  this.seen = input.seen;
}

/**
 *  Helper to test for cyclic depenendeices.
 *
 *  @private {function} cyclic
 *  @param {String} file path to the file to load.
 *  @param {Array} list of paths in the hierarchy.
 *  @param {String} name the name of the declaring file.
 *
 *  @throws Error if a circular dependency is detected.
 */
function cyclic(state, file, hierarchy, name) {

  let i
    , source = state.input.absolute(file)
    , dest;

  for(i = 0;i < hierarchy.length;i++) {
    dest = state.input.absolute(hierarchy[i]);
    if(source === dest) {
      throw new Error(
        `cyclic dependency detected in ${name} (${source} <> ${dest})`);
    }
  }
}

/**
 *  Read file contents.
 *
 *  @private {function} read
 */
function read(group, parent, state, cb) {
  const file = group.file;

  // cyclic dependency: must be tested before the logic to ignore 
  // duplicate components as we want to notify users on circular dependency
  try {
    cyclic(state, file, state.hierarchy, parent ? parent.file : null);
  }catch(e) {
    return cb(e); 
  }

  // duplicate component: do no not re-read components that have already 
  // been loaded
  let pth = state.input.absolute(file);

  if(~state.seen.imports.indexOf(pth)) {
    group.duplicates.push(pth);
    return cb();
  }
  state.seen.imports.push(pth);

  fs.readFile(pth, (err, contents) => {
    if(err) {
      return cb(err); 
    }

    group.parent = parent;
    group.contents = contents.toString();

    // empty component file
    if(!group.contents) {
      return cb(new Error(`empty component file ${file}`));
    }

    // prepend the loaded group information so that
    // dependencies appear before the declaring group
    state.out.unshift(group);

    if(parent) {
      parent.imports.unshift(group); 
    }

    group.querySelectorAll = state.parser.parse(group.contents);

    const $ = group.querySelectorAll
      , dependencies = $(state.input.selectors.imports);

    // component has dependencies we need to load
    if(dependencies.length) {

      // track hierarchy
      state.hierarchy.push(group.file);

      // map of dependencies
      let deps = [];

      dependencies.each((index, elem) => {
        const href = $(elem).attr('href'); 
        deps.push(href);
      })

      // resolve relative to the parent file: `group`
      sources(deps, state.input, state.output, state, group, cb);

    // no dependencies move on to the next item in the list
    }else{
      cb();
    }
  })
}

/** 
 *  Loads and parses the input source files.
 *
 *  Produces a map of file names to file contents.
 *
 *  @private {function} sources
 *
 *  @param {Object} state processing state.
 *  @param {Function} cb callback function.
 */
function sources(files, input, output, state, parent, cb) {
  if(parent instanceof Function) {
    cb = parent;
    parent = null;
  }

  input.each(
    files,
    (file, next) => {
    
      if(!parent) {
        // create a state per file so that the hierarchy
        // is correct, note the load state proxies some fields
        // from the global compiler state for ease of use
        state = new LoadState(input, output);     
      }

      let base
        , pth;

      if(parent && parent.file) {
        base = path.dirname(parent.file); 
      }

      pth = state.input.absolute(file, base);

      if(!parent && ~state.seen.sources.indexOf(pth)) {
        // this could just ignore and move on to the next
        // file to process but prefer to be strict and error
        return cb(
          new Error(`duplicate component source file ${file}`));
      }

      state.seen.sources.push(pth);

      const group = new state.input.components.File(pth);
      group.href = file;

      read(group, parent, state, (err) => {
        if(err) {
          return next(err); 
        } 

        // add to root of tree hierarchy
        if(!parent) {
          state.tree.imports.push(group);
        }

        next();
      });
    },
    cb
  );
}

function plugin(/*state, conf*/) {
  return function load(state, cb) {
    if(!state.files || !state.files.length) {
      return cb(new Error('no input files specified'));
    }

    // run processing for the state sources
    sources(state.files, state, state.result.files, null, (err) => {
      if(err) {
        return cb(err); 
      } 

      cb(null, state);
    });
  }
}

module.exports = plugin;
