# Load

> Reads the web component import tree

Reads HTML imports into the component tree resolving files using the registered protocol plugins.

```html
<link rel="import" href="components.html">
```

When protocol plugins are defined as strings and do not resolve to an absolute path they are deemed to be modules to require and are prefixed with `trucks-resolver-` such that `http` will require the `trucks-resolver-http` package.

See the [core][resolver-core], [file][resolver-file], [http][resolver-http] and [npm][resolver-npm] protocol resolver plugins.

## Install

```
npm i trucks-plugin-load --save-dev
```

***
<!-- @toc -->
***

## Usage

This plugin is bundled with the core [trucks-compiler][] library.

If a `protocols` array is declared on the options it is used:

```javascript
const options = {
  protocols: ['file']
}
```

Configure this plugin using the `load` field:

```javascript
const options {
  conf: {
    plugins: {
      load: {
        /* plugin configuration */
      }
    }
  }
}
```

Or as a convenient shortcut use the top-level `load` field:

```javascript
const options {
  load: {
    /* plugin configuration */
  }
}
```

<? @include resolvers.md ?>

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
