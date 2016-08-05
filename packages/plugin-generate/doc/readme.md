# Generate

> Generate output file contents

For each default output type create an output file. When no transforms are enabled this makes the compiler pass through HTML, CSS and Javascript declared in the input component files.

## Install

```
npm i trucks-plugin-generate --save-dev
```

***
<!-- @toc -->
***

## Usage

This plugin is bundled with the core [trucks-compiler][] library.

You can configure this plugin using the `generate` field:

```javascript
const options {
  conf: {
    plugins: {
      generate: {
        /* plugin configuration */
      }
    }
  }
}
```

Or as a convenient shortcut use the top-level `generate` field:

```javascript
const options {
  generate: {
    /* plugin configuration */
  }
}
```

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
