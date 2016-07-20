/**
 *  Encapsulates the load state information.
 *
 *  @private {constructor} LoadState
 */
function LoadInfo() {

  // current import resolver
  this.resolver = null;

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
      , resolver = info.resolver;

  // cyclic dependency: must be tested before the logic to ignore 
  // duplicate components as we want to notify users on circular dependency
  try {
    cyclic(state, info, file, parent ? parent.file : null);
  }catch(e) {
    return cb(e); 
  }

  // duplicate component: do no not re-read components that have already 
  // been loaded
  //let pth = info.resolver.getCanonicalPath(parent);

  // TODO: ensure the file gets a reference to the existing parsed component
  if(~info.seen.imports.indexOf(file)) {
    group.duplicates.push(file);
    return cb();
  }

  info.seen.imports.push(file);

  //fs.readFile(file, (err, contents) => {
  resolver.getFileContents((err, contents) => {
    if(err) {
      return cb(err); 
    }

    group.parent = parent;
    group.contents = contents.toString();

    // empty component file
    if(!group.contents) {
      return cb(new Error(`empty component file ${file}`));
    }

    if(parent) {
      parent.imports.unshift(group); 
    }

    // new api
    group.vdom =  state.parse(group.contents);

    // backwards compat
    group.querySelectorAll = group.vdom;

    const $ = group.querySelectorAll
      , dependencies = $(state.selectors.imports);

    // component has dependencies we need to load
    if(dependencies.length) {

      // track hierarchy
      info.hierarchy.push(group.file);

      // map of dependencies
      let deps = [];

      dependencies.each((index, elem) => {
        const href = $(elem).attr('href'); 
        deps.push(href);
      })

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

  const url = require('url')
      , FileResolver = require('./file').Resolver;
 
  // default file resolver handler
  let handler
    // handler for a protocol
    , resolver;

  state.each(
    files,
    (file, next) => {
    
      if(!parent) {
        // for each file without a parent reset so that the hierarchy
        // is correct
        info.hierarchy = [];
      }

      let pth
        , uri = url.parse(file);

      handler = new FileResolver(state, file, uri, parent); 

      // no scheme or file:// use the default handler
      if(!uri.scheme || uri.scheme === FileResolver.SCHEME) {
        resolver = handler;
      }

      // reference to the current resolver
      info.resolver = resolver;

      pth = resolver.getCanonicalPath();

      if(!parent && ~info.seen.sources.indexOf(pth)) {
        // this could just ignore and move on to the next
        // file to process but prefer to be strict and error
        return cb(
          new Error(`duplicate component source file ${file}`));
      }

      info.seen.sources.push(pth);

      // allow resolver to fetch remote resources
      resolver.fetch(
        (err) => {
          if(err) {
            return next(err); 
          }

          // allow resolver to return new local path
          const pth = resolver.getResolvedPath();

          const group = new state.components.File(pth);
          group.href = file;

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
        }
      );
    },
    cb
  );
}

function load(/*state, conf*/) {

  // plugin registry for resolvers
  //const registry = conf.registry || [];

  //console.log(registry);

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
