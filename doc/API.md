## API

---

- [API](#api)
  - [trucks](#trucks)
    - [Options](#options)
  - [trucks.load](#trucksload)
    - [Options](#options-1)
  - [trucks.parse](#trucksparse)
  - [trucks.transform](#truckstransform)
    - [Options](#options-2)
  - [trucks.generate](#trucksgenerate)
    - [Options](#options-3)
  - [trucks.write](#truckswrite)
    - [Options](#options-4)
  - [trucks.compile](#truckscompile)
    - [Options](#options-5)
    - [Throws](#throws)

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
* `conf` Array|String configuration files to load as options.
* `babel` Object options to pass to babel transform.
* `out` String output directory for files.
* `name` String=components name of the output files.
* `html` String path to write the generated template markup.
* `css` String path to write the generated stylesheet.
* `js` String path to write the generated javascript.
* `force` Boolean overwrite files that already exist.
* `eol` String override the default EOL for concatenation.

### trucks.load

```javascript
trucks.load(opts, cb)
```

Read the component definition file contents.

* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `files` Array list of HTML files to compile.

### trucks.parse

```javascript
trucks.parse(loaded[, opts], cb)
```

Parses the loaded file data to stylesheet and javascript strings.

* `loaded` Object The result from the load phase.
* `opts` Object processing options.
* `cb` Function callback function.

### trucks.transform

```javascript
trucks.transform(parsed[, opts], cb)
```

Transforms the parsed result compiling the html `<template>` element
corresponding to a javascript component definition to a function.

* `parsed` Object The result from the parse phase.
* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `babel` Object options to pass to babel transform.

### trucks.generate

```javascript
trucks.generate(transformed[, opts], cb)
```

Concatenates the transformed result to stylesheet and javascript strings.

* `transformed` Object The result from the transform phase.
* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `eol` String override the default EOL for concatenation.

### trucks.write

```javascript
trucks.write(generated, opts, cb)
```

Writes the generated result to stylesheet and javascript files.

If the `out` option is given then all files are written to the target
directory using the `name` option, file extensions are added automatically.

When the `html`, `css` and `js` options are given they override any paths
built using the `out` and `name` options.

* `generated` Object The result from the generate phase.
* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `out` String output directory for files.
* `name` String=components name of the output files.
* `html` String path to write the generated template markup.
* `css` String path to write the generated stylesheet.
* `js` String path to write the generated javascript.
* `force` Boolean overwrite files that already exist.

### trucks.compile

```javascript
trucks.compile(html, opts)
```

Compile an HTML string to a list of babel AST programs representing each
`<template>` element in the input HTML.

The return object contains a `list` array with information about each
compiled `<template>` element including the compiled function `body` and
a `render` function as an AST program.

It also contains a `map` object which is an AST program representing a map
of component identifiers (extracted from the template `id` attribute by
default) to render functions.

To generate the string code for the template map:

```javascript
const trucks = require('trucks')
  , babel = require('babel-core')
  , tpl = '<template id="x-component"></template>'
  , info = trucks.compile(tpl)
  , result = babel.transformFromAst(info.map);
console.log(result.code);
```

Returns an object representing the templates as AST programs.

* `html` String an HTML string.
* `opts` Object processing options.

#### Options

* `attr` String=id the attribute name used for the component id.
* `skate` String=skate the name of the skatejs variable.
* `vdom` String=vdom the name of the vdom property.
* `element` String=element the name of the element function.
* `text` String=text the name of the text function.
* `normalize` Boolean=true normalize whitespace in templates.
* `literals` Object|Boolean flags for template literal support.
* `load` Object options to use when parsing the DOM.

#### Throws

* `Error` if a template element does not define an identifier.

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 2, 2016

