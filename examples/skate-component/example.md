# Skate Example

This document demonstrates using the [skate][] compiler transform.

***
<!-- @toc -->
***

### Compiler Options

<? @source {javascript} options.js ?>

### Source Files

Component definition file:

<? @source {html} components.html ?>

### Markup

Example component usage:

<? @source {html} index.html ?>

<? @exec mkdir -p build && node example.js ?>

## Developer

Developers that have configured the project can run `mk` and open `index.html` to see the rendered component, run `node server.js` and visit `http://localhost:3000` to serve over HTTP.

<? @include ../../doc/readme/links.md ?>

