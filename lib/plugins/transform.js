'use strict';

function visit(state, visitors, node, cb) {
  var components = state.components,
      File = components.File,
      Module = components.Module,
      Component = components.Component,
      Template = components.Template,
      Style = components.Style,
      Script = components.Script,
      COMPLETE = 'complete';

  function canVisit(key) {

    var valid = false;
    switch (key) {
      case '*':
        valid = true;
        break;
      case 'File':
        valid = node instanceof File;
        break;
      case 'Module':
        valid = node instanceof Module;
        break;
      case 'Component':
        valid = node instanceof Component;
        break;
      case 'Template':
        valid = node instanceof Template;
        break;
      case 'Style':
        valid = node instanceof Style;
        break;
      case 'Script':
        valid = node instanceof Script;
        break;
    }

    return valid;
  }

  state.each(visitors,

  // iterate list of visitors (transformations)
  function (visitor, visited) {
    var keys = Object.keys(visitor);
    state.each(keys, function (key, next) {

      if (key === COMPLETE) {
        return next();
      }

      if (canVisit(key)) {
        // try to call the visitor function with the item
        try {
          return visitor[key](node, next);
        } catch (e) {
          return next(e);
        }
      }

      // not visiting this node
      next();
    }, visited);
  }, cb);
}

function plugin(state, conf) {
  var visitors = conf.visitors || [];

  if (!Array.isArray(visitors)) {
    throw new Error('transform visitors array expected');
  }

  var list = visitors.map(function (visitor) {

    // NOTE: require strings as plugins
    if (visitor === String(visitor)) {
      visitor = require('trucks-transform-' + visitor);
    }

    return visitor(state);
  });

  return function transform(state, cb) {

    var tree = state.tree,
        items = [];

    // collect items to iterate
    // so we can do it async
    tree.iterator(function (item) {
      items.push(item);
    });

    state.each(items, function (item, next) {
      visit(state, list, item, next);
    }, function (err) {
      if (err) {
        return cb(err);
      }

      // call complete functions
      state.each(list, function (visitor, next) {
        if (visitor.complete instanceof Function) {
          return visitor.complete(next);
        }
        next();
      }, cb);
    });
  };
}

module.exports = plugin;