# Stylus Transform

> Compile stylus sources

Reads `<style>` and `<link>` elements with a MIME type of `text/stylus` and compiles the source to CSS.

```html
<link rel="stylesheet" type="text/stylus" href="styles.styl">
<style type="text/stylus"></style>
```

This transform rewrites the `contents` property of each style node.

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

<? @include {=readme} usage.md ?>

<? @include ../../../doc/readme/license.md ?>
<? @include ../../../doc/readme/links.md ?>
