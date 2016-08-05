# Usage Transform

> Generate component usage examples

For each component module definition scan the input document for elements matching the component tag name and write them to usage HTML files.

## Install

```
npm i trucks-transform-usage --save-dev
```

***
<!-- @toc -->
***

## Usage

Use the `usage` key to configure this transform:

<? @source {javascript=s/(\.\.\/)+lib\/index/trucks-compiler/gm} usage.js ?>

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
