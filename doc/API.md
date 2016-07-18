## API

---

- [API](#api)
  - [trucks](#trucks)
    - [Options](#options)
  - [CompilerState](#compilerstate)
    - [CompilerState](#compilerstate-1)
  - [OutputFile](#outputfile)
    - [OutputFile](#outputfile-1)
    - [prepend](#prepend)
    - [append](#append)
    - [contents](#contents)
  - [ComponentTree < ComponentImport](#componenttree-componentimport)
  - [ComponentFile < ComponentImport](#componentfile-componentimport)
    - [ComponentFile](#componentfile)
  - [ComponentModule < ComponentNode](#componentmodule-componentnode)
    - [ComponentModule](#componentmodule)
  - [ComponentTemplate < ComponentTrait](#componenttemplate-componenttrait)
  - [ComponentStyle < ComponentTrait](#componentstyle-componenttrait)
  - [ComponentScript < ComponentTrait](#componentscript-componenttrait)
  - [Component < ComponentNode](#component-componentnode)
    - [Component](#component)

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

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on July 18, 2016

[trucks]: https://github.com/tmpfs/trucks
[trucks-cli]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli
[skatejs]: https://github.com/skatejs/skatejs
[webcomponents]: https://github.com/w3c/webcomponents
[shadow-dom]: https://w3c.github.io/webcomponents/spec/shadow/
[custom-elements]: https://www.w3.org/TR/custom-elements/
[html-imports]: https://w3c.github.io/webcomponents/spec/imports/
[html-templates]: https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
[polymer]: https://www.polymer-project.org/1.0/
[react]: https://facebook.github.io/react/
[react-webcomponents]: https://github.com/facebook/react/issues/5052
[react-integration]: https://github.com/skatejs/react-integration
[mozilla-webcomponents]: https://hacks.mozilla.org/2014/12/mozilla-and-web-components/
[csp]: http://content-security-policy.com/
[npm]: https://www.npmjs.com/
[postcss]: https://github.com/postcss/postcss
[mkdoc]: https://github.com/mkdoc/mkdoc
[mkapi]: https://github.com/mkdoc/mkapi
[mkparse]: https://github.com/mkdoc/mkparse
[jshint]: http://jshint.com
[jscs]: http://jscs.info
[sources]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-sources
[load]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-load
[parse]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-parse
[transform]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-transform
[generate]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-generate
[write]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-write
[skate]: https://github.com/tmpfs/trucks/blob/master/packages/transform-skate
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass

