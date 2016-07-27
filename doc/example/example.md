## Example

This document demonstrates the compiler output. Developers that have configured the project can run `mk example` and open [index.html](/doc/example/index.html) to see the rendered component.

***
<!-- @toc -->
***

### Source Files

Component definition file [components.html](/doc/example/components.html):

<? @source {html} components.html ?>

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


