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

```javascript
const trucks = require('trucks')
  , tpl = '<template id="x-component"></template>'
  , {map, main, list} = trucks.compile(tpl);
```

Compile an HTML string to babel AST programs representing each `<template>` 
element in the input HTML.

The return object contains a `map` object which is an AST program 
representing a map of component identifiers (extracted from the template 
`id` attribute by default) to render functions. 

To generate the string code for the template map:

```javascript
const trucks = require('trucks')
  , babel = require('babel-core')
  , tpl = '<template id="x-component"></template>'
  , info = trucks.compile(tpl)
  , {code} = babel.transformFromAst(info.map);
console.log(code);
```

The main function is exposed on the return object as a `main` property, it 
is an AST program.

The return object also contains a `list` array with information about each 
compiled `<template>` element including the compiled function `body` and 
a `render` function as an AST program. Typically there is no need for 
consumers to use this property as the `map` and `main` fields are enough 
to generate the compiled code.

Template literal support is not enabled by default. You can pass the 
`literals` option as `true` to enable template literals for attributes and 
text nodes or an object that configures the `text` and `attribute` flags.

The following examples are equivalent:

```javascript
trucks.compile(tpl, {literals: true});
trucks.compile(tpl, {literals: {text: true, attribute: true});
```

Returns an object representing the templates as AST programs.

* `html` String an HTML string.
* `opts` Object processing options.

#### Options

* `attr` String=id attribute name used for the component id.
* `skate` String=skate name of the skatejs variable.
* `vdom` String=vdom name of the vdom property.
* `element` String=element name of the element function.
* `text` String=text name of the text function.
* `templates` String=templates name of the templates map.
* `main` String=template name of the main function.
* `normalize` Boolean=true normalize whitespace in templates.
* `literals` Object|Boolean flags for template literal support.
* `load` Object options to use when parsing the DOM.

#### Throws

* `Error` if a template element does not define an identifier.

