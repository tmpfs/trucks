# Page Generator

> Inject output files into HTML templates 

For each input file in the `files` map replace processing instructions with the output of calling tag functions.

The default implementation supports an `@file` tag grammar function which replaces processing instructions with output file contents:

```html
<!doctype html>
<html>
  <head>
    <style><? @file components.css ?></style>
    <script><? @file components.js ?></script>
  </head>
  <body>
    <? @file usage.html ?>
  </body>
</html>
```

## Install

```
npm i trucks-generator-page --save-dev
```

***
<!-- @toc -->
***

## Usage

Use the `page` key to configure this transform:

<? @source {javascript=s/(\.\.\/)+lib\/index/trucks-compiler/gm} usage.js ?>

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
