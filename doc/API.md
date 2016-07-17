## API

---

- [API](#api)
  - [trucks](#trucks)
    - [Options](#options)

---

### trucks

```javascript
trucks(opts, cb)
```

Compile component files to CSS, Javascript and HTML.

* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `files` Array list of HTML files to compile.
* `rc` Array|String configuration files to load as options.
* `babel` Object options to pass to babel transform.
* `extract` Boolean=false do not compile templates, write to file.
* `trim` Object configure whitespace trim options.
* `out` String output directory for files.
* `name` String=components name of the output files.
* `html` String path to write the generated template markup.
* `css` String path to write the generated stylesheet.
* `js` String path to write the generated javascript.
* `force` Boolean overwrite files that already exist.
* `eol` String override the default EOL for concatenation.

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 18, 2016

