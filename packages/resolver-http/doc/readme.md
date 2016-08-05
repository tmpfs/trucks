# HTTP Resolver

> HTML import resolver for the http: and https: schemes.

Resolves HTML imports using the `http:` and `https:` schemes.

```html
<link rel="import" href="https://example.com/components.html">
```

## Install

```
npm i trucks-resolver-http --save-dev
```

For the command line interface see [trucks-cli][].

***
<!-- @toc -->
***

## Usage

Register the `http` protocol plugin:

```javascript
const options {
  files: ['https://example.com/components.html'],
  protocols: ['http']
}
```

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
