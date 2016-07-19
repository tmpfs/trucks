# Style Inject

> Inject component styles from files

For each input component read a file containing all component styles and overwrite the output styles for the component, designed to be used with files created by [style-extract][].

Files are read from the directory specified using the `dir` option.

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

<? @include {=readme} usage.md ?>

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../doc/readme/license.md ?>
<? @include ../../../doc/readme/links.md ?>
