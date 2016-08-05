# Generate

> Run generator plugins

Run generator plugins defined in the `generators` list.

For each default output type create an output file if it does not already exist, which means that when no transforms are enabled this makes the compiler pass through HTML, CSS and Javascript declared in the input component files.

When generator plugins are defined as strings and do not resolve to an absolute path they are deemed to be modules to require and are prefixed with `trucks-generator-` such that `page` will require the `trucks-generator-page` package.

## Install

```
npm i trucks-plugin-generate --save-dev
```

***
<!-- @toc -->
***

## Usage

This plugin is bundled with the core [trucks-compiler][] library.

If a `generators` array is declared on the options it is used:

```javascript
const options = {
  generators: ['page']
}
```

Configure this plugin using the `generate` field:

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
