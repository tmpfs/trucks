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

### CompilerState

Encapsulates the state of the compiler plugin execution.

#### CompilerState

```javascript
public CompilerState(options)
```

Creates a compiler state.

* `options` Object computed options.

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

