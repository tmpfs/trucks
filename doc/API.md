## API

### trucks

```javascript
trucks(opts, cb)
```

Compile component HTML files to CSS and Javascript.

* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `files` Array list of HTML files to compile.
* `babel` Object options to pass to babel transform.
* `css` String path to write the generated stylesheet.
* `js` String path to write the generated javascript.
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

* `generated` Object The result from the generate phase.
* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `css` String path to write the generated stylesheet.
* `js` String path to write the generated javascript.

### trucks.compile

```javascript
trucks.compile(html, opts)
```

Compile an HTML string to a babel AST program.

* `html` String an HTML string.
* `opts` Object processing options.

#### Options

* `attr` String=id the attribute name used for the component id.
* `skate` String=skate the name of the skatejs variable.
* `vdom` String=vdom the name of the vdom property.
* `element` String=element the name of the element function.
* `text` String=text the name of the text function.

