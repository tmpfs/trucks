"use strict";

function plugin() /*state, conf*/{

  return function generate(state, cb) {
    var opts = state.options;

    var file = void 0;

    if (opts.html && opts.extract && !state.hasFile(opts.html)) {
      // concatenate all templates
      var templates = state.result.templates.map(function (tpl) {
        return tpl.contents;
      });
      file = state.getFile(opts.html);
      file.contents = templates;
    }

    if (opts.css && !state.hasFile(opts.css)) {
      // concatenate all style contents
      var styles = state.result.styles.map(function (style) {
        return style.contents;
      });
      file = state.getFile(opts.css);
      file.contents = styles;
    }

    if (opts.js && !state.hasFile(opts.js)) {
      // concatenate all javascript contents
      var scripts = state.result.scripts.map(function (script) {
        return script.code;
      });

      file = state.getFile(opts.js);
      file.contents = scripts;
    }

    cb(null, state);
  };
}

module.exports = plugin;