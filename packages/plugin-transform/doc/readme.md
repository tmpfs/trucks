# Transform

> Transforms the component tree

Runs plugin functions that visit the component tree nodes and perform transformations.

When transform plugins are defined as strings and do not resolve to an absolute path they are deemed to be modules to require and are prefixed with `trucks-transform-` such that `csp` will require the `trucks-transform-csp` package.

## Install

```
npm i trucks-plugin-transform --save-dev
```

***
<!-- @toc -->
***

## Usage

This plugin is bundled with the core [trucks-compiler][] library.

If a `transforms` array is declared on the options it is used:

```javascript
const options = {
  transforms: ['csp']
}
```

Configure this plugin using the `transform` field:

```javascript
const options {
  conf: {
    plugins: {
      transform: {
        /* plugin configuration */
      }
    }
  }
}
```

Or as a convenient shortcut use the top-level `transform` field:

```javascript
const options {
  transform: {
    /* plugin configuration */
  }
}
```

<? @include ../../../documents/transforms.md ?>

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
