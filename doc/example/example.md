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

Compiled javascript:

<? @source {javascript} build/components.js ?>

### Stylesheet

Compiled stylesheet:

<? @source {css} build/components.css ?>

### Markup

<? @source {html} index.html ?>

<? @include ../readme/links.md ?>


