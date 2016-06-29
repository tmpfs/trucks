## Compiler

The compiler executes the following phases:

* `load`: Load all source HTML files given with the `files` option and resolve the HTML imports.
* `parse`: Parse the imported files resolving inline and external styles and javascript and inline template elements.
* `transform`: Transform the imported component files compiling `<template>` elements to javascript.
* `generate`: Convert the transformed components to css and javascript strings.
* `write`: Write the generated code to disc.

## Load

Given a components file [components.html](/example/compiler/components.html) such as:

<? @source {html} ../../example/compiler/components.html ?>

The load phase will build the result object:

<? @exec {json} node doc/readme/compiler-load.js ?>

Imported component file paths are resolved relative to the declaring file.

## Parse

The parse phase takes the output from the load phase and extracts the css, javascript and template elements:

<? @exec {json} node doc/readme/compiler-parse.js ?>

