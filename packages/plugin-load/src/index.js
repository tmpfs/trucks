const PREFIX = 'trucks-resolver-';

/**
 *  Encapsulates the load state information.
 *
 *  @private {constructor} LoadState
 */
function LoadInfo() {

  // keep track of processed files during load phase
  this.seen  = {
    imports: [],
    sources: []
  }

  // list of parent file hierarchies used to detect circular imports
  this.hierarchy = [];
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
function cyclic(state, info, file, name) {
  const hierarchy = info.hierarchy;

  let i
    , source = state.absolute(file)
    , dest;

  for(i = 0;i < hierarchy.length;i++) {
    dest = state.absolute(hierarchy[i]);
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
function read(state, group, parent, info, cb) {

  // file path is now the resolved path
  const file = group.file
      , resolver = group.resolver;

  // cyclic dependency: must be tested before the logic to ignore 
  // duplicate components as we want to notify users on circular dependency
  try {
    cyclic(state, info, file, parent ? parent.file : null);
  }catch(e) {
    return cb(e); 
  }

  // duplicate component: do no not re-read components that have already 
  // been loaded

  // TODO: ensure the file gets a reference to the existing parsed component
  if(~info.seen.imports.indexOf(file)) {
    group.duplicates.push(file);
    return cb();
  }

  info.seen.imports.push(file);

  resolver.resolve((err, contents) => {
    if(err) {
      return cb(err); 
    }

    contents = contents.toString();

    group.parent = parent;
    group.contents = contents;

    // empty component file
    if(!group.contents) {
      return cb(new Error(`empty component file ${file}`));
    }

    if(parent) {
      parent.imports.unshift(group); 
    }

    // reference to the virtual dom for the file
    group.vdom = state.parse(group.contents);

    const vdom = group.vdom
      , dependencies = vdom(state.selectors.imports);

    // component has dependencies we need to load
    if(dependencies.length) {

      // track hierarchy
      info.hierarchy.push(group.file);

      // map of dependencies
      let deps = [];

      dependencies.each((index, elem) => {
        const href = vdom(elem).attr('href'); 
        deps.push(href);
      })

      deps = deps;

      // resolve relative to the parent file: `group`
      sources(state, info, deps, group, cb);

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
function sources(state, info, files, parent, cb) {
  if(parent instanceof Function) {
    cb = parent;
    parent = null;
  }

  // handler for a scheme
  let resolver;

  state.each(
    files,
    (file, next) => {
    
      if(!parent) {
        // for each file without a parent reset so that the hierarchy
        // is correct
        info.hierarchy = [];
      }

      let pth;

      try {
        resolver = state.getResolver(file, parent ? parent.resolver : null);
      }catch(e) {
        return next(e); 
      }

      pth = resolver.file = resolver.getCanonicalPath();

      if(!parent && ~info.seen.sources.indexOf(pth)) {
        // this could just ignore and move on to the next
        // file to process but prefer to be strict and error
        return cb(
          new Error(`duplicate component source file ${file}`));
      }

      info.seen.sources.push(pth);

      // allow resolver to return new local path: getResolvedPath()
      const group = new state.components.File(resolver.file);

      // raw input string (href)
      group.href = file;
      // reference to the resolver
      group.resolver = resolver;

      // read in file contents
      read(state, group, parent, info, (err) => {
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

function load(state, conf) {
  let protocols = state.options.protocols || conf.protocols || [];

  if(!Array.isArray(protocols)) {
    throw new Error(`protocols array expected`); 
  }

  const DEFAULT = 'file';

  // prepend default resolver plugin
  if(!~protocols.indexOf(DEFAULT)) {
    protocols.unshift(DEFAULT);
  }

  // protocol resolver plugins
  const closures = state.middleware(
    {
      phases: protocols,
      prefix: PREFIX,
      lookup: state.options.conf.protocols
    }
  );

  // call middleware closures in scope of the registry synchronously
  closures.forEach((fn) => {
    fn(state.registry); 
  })

  return function load(state, cb) {
    if(!state.files || !state.files.length) {
      return cb(new Error('no input files specified'));
    }

    const info = new LoadInfo();

    // run processing for the state sources
    sources(state, info, state.files, (err) => {
      if(err) {
        return cb(err); 
      } 
      cb(null, state);
    });
  }
}

module.exports = load;
