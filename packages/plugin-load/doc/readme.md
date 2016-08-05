# Load

> Reads the web component import tree

Reads HTML imports into the component tree resolving files using the registered protocol plugins.

```html
<link rel="import" href="components.html">
```

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

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
