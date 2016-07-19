# Style Extract

> Extract component styles to files

For each input component write a file containing all component styles (shadow scope) to a file.

Files are named using the component id and written to the directory specified using the `dir` option.

Be careful using this transform with the `force` option, if you have already edited the generated styles they will be overwritten.

<? @include {=readme} install.md ?>

***
<!-- @toc -->
***

<? @include {=readme} usage.md ?>

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../doc/readme/license.md ?>
<? @include ../../../doc/readme/links.md ?>
