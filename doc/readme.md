# Trucks

<? @include readme/badges.md ?>

> Web component compiler and package manager

Compiles web components declared as HTML to separate Javascript, CSS and HTML files.

Designed primarily for [skatejs][] with support for [polymer][] coming soon.

Uses ES6 code transpiled for `node@4.x` compatibility.

<? @include {=readme}
      install.md 
      abstract.md ?>

***
<!-- @toc -->
***

<? @include {=readme}
      usage.md 
      components.md
      plugins.md
      transforms.md ?>

## Documentation

An example for [skatejs][] is shown in [EXAMPLE](/doc/EXAMPLE.md), source files are in [doc/example](/doc/example). 

For the API docs see [API](/doc/API.md), an overview of the available options is in [OPTIONS](/doc/OPTIONS.md). For insights into the compiler phases and data structures see [COMPILER](/doc/COMPILER.md).

The [ROADMAP](/doc/ROADMAP.md) has some ideas for future features.

Information on how to build this project is in [DEVELOPER](/doc/DEVELOPER.md).

## Notes

Components defined for [skatejs][] can ignore the HTML file as the templates are compiled to javascript; the command line interface will not generate an HTML file as it compiles for [skatejs][] by default.

When authoring components using [polymer][] you would need to include the resulting HTML page containing all `<template>` elements in to your HTML page(s), how you do this depends upon your build process. Use the `--extract` option when compiling with the command line interface to also generate an HTML file containing the template elements.

<? @include {=readme}
      license.md
      links.md ?>
