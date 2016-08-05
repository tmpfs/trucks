# NPM Resolver

> HTML import resolver for the npm: scheme

Resolves HTML imports using the `npm:` scheme.

```html
<link rel="import" href="npm://@ui/components@1.0.0">
```

## Install

```
npm i trucks-resolver-npm --save-dev
```

For the command line interface see [trucks-cli][].

***
<!-- @toc -->
***

## Usage

Register the `npm` protocol plugin:

```javascript
const options {
  files: ['npm://@ui/components@1.0.0'],
  protocols: ['npm']
}
```

## API

<? @exec mkapi src/index.js --level=3 ?>

<? @include ../../../documents/license.md ?>
<? @include ../../../documents/links.md ?>
