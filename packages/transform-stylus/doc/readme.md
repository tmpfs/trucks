# Stylus Transform

> Compile stylus sources

Reads `<style>` and `<link>` elements with a MIME type of `text/stylus` and compiles the source to CSS.

```html
<link rel="stylesheet" type="text/stylus" href="styles.styl">
<style type="text/stylus"></style>
```

This transform rewrites the `contents` property of each style node.

## Install

```
npm i trucks-transform-stylus --save-dev
```

***
<!-- @toc -->
***

## Usage

Use the `stylus` key to configure this transform:

<? @source {javascript=s/(\.\.\/)+lib\/index/trucks-compiler/gm} usage.js ?>

The configuration object is passed to `stylus.render()`, see the [stylus documentation][stylus-css].

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
