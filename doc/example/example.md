## Example

This document demonstrates the compiler output.

***
<!-- @toc -->
***

### Source Files

Source component collection [components.html](/doc/example/components.html):

<? @source {html} components.html ?>

Component definition file [x-panel.html](/doc/example/x-panel.html):

<? @source {html} x-panel.html ?>

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


