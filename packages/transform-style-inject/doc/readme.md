# Style Inject

> Inject component styles from files

For each input component read a file containing all component styles and overwrite the output styles for the component, designed to be used with files created by [style-extract][].

Files are read from the directory specified using the `dir` option, if a file is not found for a given component no modification of the styles is performed otherwise the styles for the component are removed and replaced with styles from the file.

## Install

```
npm i trucks-transform-style-inject --save-dev
```

***
<!-- @toc -->
***

## Usage

Use the `style-inject` key to configure this transform:

<? @source {javascript=s/(\.\.\/)+lib\/index/trucks-compiler/gm} usage.js ?>

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
