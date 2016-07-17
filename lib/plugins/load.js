'use strict';

var fs = require('fs'),
    path = require('path');

/**
 *  Encapsulates the load state information.
 *
 *  @private {constructor} LoadState
 *  @param {Object} state compiler state input object.
 *  @param {Array} output list for the output result objects.
 */
function LoadInfo(state, output) {
  this.output = output;

  // keep track of processed files during load phase
  this.seen = {
    imports: [],
    sources: []
  };

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
  var hierarchy = info.hierarchy;

  var i = void 0,
      source = state.absolute(file),
      dest = void 0;

  for (i = 0; i < hierarchy.length; i++) {
    dest = state.absolute(hierarchy[i]);
    if (source === dest) {
      throw new Error('cyclic dependency detected in ' + name + ' (' + source + ' <> ' + dest + ')');
    }
  }
}

/**
 *  Read file contents.
 *
 *  @private {function} read
 */
function read(state, group, parent, info, cb) {
  var file = group.file;

  // cyclic dependency: must be tested before the logic to ignore
  // duplicate components as we want to notify users on circular dependency
  try {
    cyclic(state, info, file, parent ? parent.file : null);
  } catch (e) {
    return cb(e);
  }

  // duplicate component: do no not re-read components that have already
  // been loaded
  var pth = state.absolute(file);

  if (~info.seen.imports.indexOf(pth)) {
    group.duplicates.push(pth);
    return cb();
  }

  info.seen.imports.push(pth);

  fs.readFile(pth, function (err, contents) {
    if (err) {
      return cb(err);
    }

    group.parent = parent;
    group.contents = contents.toString();

    // empty component file
    if (!group.contents) {
      return cb(new Error('empty component file ' + file));
    }

    // prepend the loaded group information so that
    // dependencies appear before the declaring group
    info.output.unshift(group);

    if (parent) {
      parent.imports.unshift(group);
    }

    group.querySelectorAll = state.parser.parse(group.contents);

    var $ = group.querySelectorAll,
        dependencies = $(state.selectors.imports);

    // component has dependencies we need to load
    if (dependencies.length) {
      (function () {

        // track hierarchy
        info.hierarchy.push(group.file);

        // map of dependencies
        var deps = [];

        dependencies.each(function (index, elem) {
          var href = $(elem).attr('href');
          deps.push(href);
        });

        // resolve relative to the parent file: `group`
        sources(state, info, deps, group, cb);

        // no dependencies move on to the next item in the list
      })();
    } else {
      cb();
    }
  });
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
  if (parent instanceof Function) {
    cb = parent;
    parent = null;
  }

  state.each(files, function (file, next) {

    if (!parent) {
      // for each file without a parent reset so that the hierarchy
      // is correct
      info.hierarchy = [];
    }

    var base = void 0,
        pth = void 0;

    if (parent && parent.file) {
      base = path.dirname(parent.file);
    }

    pth = state.absolute(file, base);

    if (!parent && ~info.seen.sources.indexOf(pth)) {
      // this could just ignore and move on to the next
      // file to process but prefer to be strict and error
      return cb(new Error('duplicate component source file ' + file));
    }

    info.seen.sources.push(pth);

    var group = new state.components.File(pth);
    group.href = file;

    read(state, group, parent, info, function (err) {
      if (err) {
        return next(err);
      }

      // add to root of tree hierarchy
      if (!parent) {
        state.tree.imports.push(group);
      }

      next();
    });
  }, cb);
}

function plugin() /*state, conf*/{
  return function load(state, cb) {
    if (!state.files || !state.files.length) {
      return cb(new Error('no input files specified'));
    }

    var info = new LoadInfo(state, state.result.files);

    // run processing for the state sources
    sources(state, info, state.files, function (err) {
      if (err) {
        return cb(err);
      }
      cb(null, state);
    });
  };
}

module.exports = plugin;