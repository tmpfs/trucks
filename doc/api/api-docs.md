### trucks

```javascript
trucks(opts, cb)
```

Compile component files to CSS, Javascript and HTML.

Returns compiler state.

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
* `html` String path to write the generated template markup.
* `css` String path to write the generated stylesheet.
* `js` String path to write the generated javascript.
* `eol` String override the default EOL for concatenation.

### CompilerState

Encapsulates the state of the compiler plugin execution.

#### CompilerState

```javascript
public CompilerState(options, compiler)
```

Creates a compiler state.

* `options` Object computed options.
* `compiler` Function reference to the main compiler entry point.

### OutputFile

Represents an output file that will be written to disc when the 
write plugin is executed.

To get an instance of this class call `state.getFile()`.

#### OutputFile

```javascript
public OutputFile(file, name, base, options)
```

Creates an output file.

* `file` String path to the file.
* `name` String relative path for the file.
* `base` STring base path for the file.
* `options` Object computed options.

#### prepend

```javascript
prepend(buf)
```

Prepend data to this output file.

* `buf` String contents to prepend to the file.

#### append

```javascript
append(buf)
```

Append data to this output file.

* `buf` String contents to append to the file.

#### contents

```javascript
Array contents
```

list of file contents.

### ComponentTree < ComponentImport

Represents the root of a component hierarchy.

### ComponentFile < ComponentImport

Represents a file in the component tree.

#### ComponentFile

```javascript
public ComponentFile(file, contents, parent)
```

Creates a component file node.

* `file` String path to the file.
* `contents` String file contents.
* `parent` Object file owner.

### ComponentModule < ComponentNode

Represents a module defined by a `<dom-module>` element.

#### ComponentModule

```javascript
public ComponentModule(id, parent)
```

Creates a component module node.

* `id` String module identifier.
* `parent` Object module owner.

### ComponentTemplate < ComponentTrait

Represents a template defined by a `<template>` or `<link>` element.

### ComponentStyle < ComponentTrait

Represents a style defined by a `<style>` or `<link>` element.

### ComponentScript < ComponentTrait

Represents a script defined by a `<script>` element.

### Component < ComponentNode

Represents a component node with a main template, list of 
template partials and component local styles.

#### Component

```javascript
public Component(template, parent)
```

Creates a component node.

* `template` Object primary template for the component.
* `parent` Object component owner (module).

