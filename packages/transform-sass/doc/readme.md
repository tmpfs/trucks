# Sass Transform

> Compile sass sources

Reads `<style>` and `<link>` elements with a MIME type of `text/sass` and compiles the source to CSS using the [bindings to libsass for node][node-sass].

```html
<link rel="stylesheet" type="text/sass" href="styles.scss">
<style type="text/sass"></style>
```

This transform rewrites the `contents` property of each style node.

<? @include {=readme} install.md  ?>

***
<!-- @toc -->
***

<? @include {=readme} usage.md config.md ?>

<? @include ../../../doc/readme/license.md ?>
<? @include ../../../doc/readme/links.md ?>
