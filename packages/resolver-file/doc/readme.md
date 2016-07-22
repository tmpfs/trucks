# File Resolver

> HTML import resolver for the file: scheme

Resolves HTML imports using the `file:` scheme.

```html
<link rel="import" href="file://components.html">
```

Default resolver for the load plugin.

## Install

```
npm i trucks-resolver-file --save-dev
```

For the command line interface see [trucks-cli][].

***
<!-- @toc -->
***

## Usage

This plugin is bundled with the core library, to explicitly configure:

```javascript
const options {
  files: ['file://components.html'],
  protocols: ['file']
}
```

For command line usage see [trucks-cli][].


## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../doc/readme/license.md ?>
<? @include ../../../doc/readme/links.md ?>
