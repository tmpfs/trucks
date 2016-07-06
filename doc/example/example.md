## Example

This document demonstrates the compiler output.

***
<!-- @toc -->
***

### Source Files

Source component files:

* [components.html](/doc/example/components.html)
* [x-panel.html](/doc/example/x-panel.html)

### Compiler Options

<? @source {javascript} options.js ?>

<? @exec mkdir -p doc/example/build && node doc/example/example.js ?>

### Javascript

<? @source {javascript} build/components.js ?>

<? @include ../readme/links.md ?>

### Stylesheet

<? @source {css} build/components.css ?>

