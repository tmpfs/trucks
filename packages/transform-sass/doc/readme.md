# Sass Transform

> Compile sass sources

Reads `<style>` and `<link>` elements with a MIME type of `text/sass` and compiles the source to CSS using the [bindings to libsass for node][node-sass].

```html
<link rel="stylesheet" type="text/sass" href="styles.scss">
<style type="text/sass"></style>
```

This transform rewrites the `contents` property of each style node.

## Install

```
npm i trucks-transform-sass --save-dev
```

***
<!-- @toc -->
***

## Usage

Use the `sass` key to configure this transform:

<? @source {javascript=s/(\.\.\/)+lib\/index/trucks-compiler/gm} usage.js ?>

The configuration object is passed to `sass.render()`, see the [sass documentation][node-sass].

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
