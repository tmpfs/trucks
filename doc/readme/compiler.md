## Compiler

The compiler executes the following phases:

* `load`: Load all source HTML files given with the `files` option and resolve the HTML imports.
* `parse`: Parse the imported files resolving inline and external styles and javascript.
* `transform`: Transform the imported component files compiling `<template>` elements to javascript.
* `generate`: Convert the transformed components to css and javascript strings.
* `write`: Write the generated code to disc.
