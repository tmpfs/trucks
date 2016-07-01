## Compiler

The compiler executes the following phases:

* `load`: Load all source HTML files given with the `files` option and resolve the HTML imports.
* `parse`: Parse the imported files resolving styles, javascript and template elements.
* `transform`: Transform the imported component files compiling `<template>` elements to javascript.
* `generate`: Convert the transformed components to css and javascript strings.
* `write`: Write the generated styles and javascript to files.

***
<!-- @toc -->
***

### Load

Given a components file [components.html](/example/compiler/components.html) such as:

<? @source {html} components.html ?>

The load phase will build the result object:

<? @exec {json} node doc/compiler/compiler-load.js ?>

Imported component file paths are resolved relative to the declaring file.

### Parse

The parse phase takes the output from the load phase and extracts the css, javascript and template elements:

<? @exec {json} node doc/compiler/compiler-parse.js ?>

### Transform

The transform phase takes the parsed result and compiles the `<template>` elements to javascript functions that can be called from the component `render()` function.

> TODO: implement and document the transform phase

<? @exec {json} node doc/compiler/compiler-transform.js ?>

Note that some data has been omitted from the example output for brevity.

### Generate

After transformation the generate phase will concatenate all the css and transformed javascript code.

<? @exec {json} node doc/compiler/compiler-generate.js ?>

Note that some data has been omitted from the example output for brevity.
