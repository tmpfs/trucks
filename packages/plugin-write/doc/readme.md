# Write

> Write output files to disc

Writes the output files created by the compiler plugins to disc.

## Install

```
npm i trucks-plugin-write --save-dev
```

***
<!-- @toc -->
***

## Usage

This plugin is bundled with the core [trucks-compiler][] library.

You can configure this plugin using the `write` field:

```javascript
const options {
  conf: {
    plugins: {
      write: {
        /* write plugin configuration */
      }
    }
  }
}
```

Or as a convenient shortcut use the top-level `write` field:

```javascript
const options {
  force: true,
  write: {
    manifest: false
  }
}
```

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
