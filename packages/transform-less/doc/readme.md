# Less Transform

> Compile less sources

Reads `<style>` and `<link>` elements with a MIME type of `text/less` and compiles the source to CSS.

```html
<link rel="stylesheet" type="text/less" href="styles.less">
<style type="text/less"></style>
```

This transform rewrites the `contents` property of each style node.

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

<? @include {=readme} usage.md ?>

<? @include ../../../doc/readme/license.md ?>
<? @include ../../../doc/readme/links.md ?>
