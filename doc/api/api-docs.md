### trucks

```javascript
trucks(opts, cb)
```

Compile component files to CSS, Javascript and HTML.

* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `files` Array list of HTML files to compile.
* `out` String output directory for files.
* `force` Boolean overwrite files that already exist.
* `name` String=components name of the output files.
* `rc` Array|String configuration files to load as options.
* `babel` Object options to pass to babel transform.
* `conf` Object configuration for plugins and transforms.
* `before` Object before hooks for plugins and transforms.
* `after` Object after hooks for plugins and transforms.
* `extract` Boolean=false do not compile templates, write to file.
* `html` String path to write the generated template markup.
* `css` String path to write the generated stylesheet.
* `js` String path to write the generated javascript.
* `eol` String override the default EOL for concatenation.

