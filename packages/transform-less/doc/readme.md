# Less Transform

> Compile less sources

Reads `<style>` and `<link>` elements with a MIME type of `text/less` and compiles the source to CSS.

```html
<link rel="stylesheet" type="text/less" href="styles.less">
<style type="text/less"></style>
```

This transform rewrites the `contents` property of each style node.

## Install

```
npm i trucks-transform-less --save-dev
```

***
<!-- @toc -->
***

## Usage

Use the `less` key to configure this transform:

<? @source {javascript=s/(\.\.\/)+lib\/index/trucks-compiler/gm} usage.js ?>

The configuration object is passed to `less.render()`, see the [less documentation][less-css].

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
